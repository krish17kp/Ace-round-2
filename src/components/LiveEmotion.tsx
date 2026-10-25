
import React, { useEffect, useRef, useState } from "react";

type Face = {
  box: [number, number, number, number];
  top: string;
  score: number;
};
const EMOJI: Record<string, string> = {
  Angry: "😠",
  Disgust: "🤢",
  Fear: "😱",
  Happy: "😊",
  Neutral: "😐",
  Sad: "😢",
  Surprise: "😮",
};
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:7860";

export default function LiveEmotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setErr("Camera blocked. Please allow camera permission.");
      }
    })();
    return () =>
      (videoRef.current?.srcObject as MediaStream | null)
        ?.getTracks()
        .forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      if (busy || !videoRef.current || !canvasRef.current) return;
      const v = videoRef.current,
        c = canvasRef.current,
        ctx = c.getContext("2d");
      if (!ctx) return;
      if (v.videoWidth === 0 || v.videoHeight === 0) return; // guard

      c.width = v.videoWidth;
      c.height = v.videoHeight;
      ctx.drawImage(v, 0, 0, c.width, c.height);

      c.toBlob(
        async (blob) => {
          if (!blob) return;
          setBusy(true);
          try {
            const form = new FormData();
            form.append("file", blob, "frame.jpg");
            const res = await fetch(${API_BASE}/predict, {
              method: "POST",
              body: form,
            });
            const json = await res.json();
            draw(ctx, json.faces || []);
          } catch {
            setErr(Backend not reachable at ${API_BASE});
          } finally {
            setBusy(false);
          }
        },
        "image/jpeg",
        0.8
      );
    }, 800);
    return () => clearInterval(iv);
  }, [busy]);

  function draw(ctx: CanvasRenderingContext2D, faces: Face[]) {
    const c = ctx.canvas;
    ctx.clearRect(0, 0, c.width, c.height);
    if (videoRef.current)
      ctx.drawImage(videoRef.current, 0, 0, c.width, c.height);

    faces.forEach((f) => {
      const [x, y, w, h] = f.box;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#10b981";
      ctx.strokeRect(x, y, w, h);
      const label = ${EMOJI[f.top] ?? ""} ${f.top} ${(f.score * 100) | 0}%;
      ctx.font = "16px system-ui, sans-serif";
      const pad = 8,
        width = ctx.measureText(label).width + pad * 2;
      ctx.fillStyle = "rgba(0,0,0,.6)";
      ctx.fillRect(x, y - 28, width, 24);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + pad, y - 10);
    });
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl rounded-2xl shadow-lg bg-white p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Live Emotion Radar</h2>
          {busy && <span className="text-sm text-gray-500">Analyzing…</span>}
        </div>
        {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      </div>
    </div>
  );
}