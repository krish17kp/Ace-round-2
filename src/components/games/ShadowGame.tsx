import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, RotateCcw, Trophy } from "lucide-react";
import gameSock from "@/assets/game-sock.png";

interface Props { onBack: () => void }

export const ShadowGame = ({ onBack }: Props) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  // 5 rounds. Swap src with new URLs or assets to add variety.
  const rounds = useMemo(() => (
    [1,2,3,4,5].map(i => ({ id: i, src: gameSock, name: "Sock" }))
  ), []);

  const target = useMemo(() => {
    const angles = [0, 90, 180, 270];
    const angle = angles[(level * 37) % angles.length];
    const flip = (level % 2) === 0;
    return { angle, flip };
  }, [level]);

  const options = useMemo(() => {
    const angles = [0, 90, 180, 270];
    const combos: Array<{ angle: number; flip: boolean }> = [];
    for (const a of angles) { combos.push({ angle: a, flip: false }); combos.push({ angle: a, flip: true }); }
    const key = (t: { angle: number; flip: boolean }) => `${t.angle}_${t.flip?1:0}`;
    const correct = target;
    const filtered = combos.filter(c => key(c) !== key(correct));
    const seed = level * 131;
    const shuffled = filtered.sort((a,b)=>(((a.angle+(a.flip?5:0)+seed)%7)-((b.angle+(b.flip?5:0)+seed)%7)));
    const pick = [correct, ...shuffled.slice(0,8)];
    const display = pick.map((t,i)=>({t,i})).sort((a,b)=>(((a.i*seed)%11)-((b.i*seed)%11)));
    return display.map((d,idx)=>({ id: idx+1, transform: d.t, correct: key(d.t)===key(correct) }));
  }, [level, target]);

  const onPick = (id: number) => {
    if (showResult) return;
    setPicked(id);
    setShowResult(true);
    if (options.find(o => o.id === id)?.correct) setScore(s => s + 100);
  };

  const next = () => {
    if (level >= rounds.length) { setDone(true); return; }
    setLevel(l => l + 1);
    setPicked(null);
    setShowResult(false);
  };

  const reset = () => {
    setLevel(1); setScore(0); setPicked(null); setShowResult(false); setDone(false);
  };

  if (done) {
    return (
      <div className="space-y-6">
        <Card className="p-6 gradient-card shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-2xl font-bold">Game Complete!</h1>
                <p className="text-muted-foreground">Shadow matching results</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-2"><Trophy className="h-4 w-4" />Final Score: {score}</Badge>
          </div>
        </Card>
        <Card className="p-8 gradient-card shadow-emotion text-center">
          <div className="space-y-6">
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full gradient-wellness shadow-glow"><Trophy className="h-12 w-12 text-white" /></div></div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Excellent Focus!</h2>
              <p className="text-xl text-muted-foreground mb-6">Final Score: <span className="font-bold text-primary">{score} points</span></p>
            </div>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <h3 className="font-semibold mb-2">Skills Developed</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Visual Attention</Badge>
                <Badge variant="outline">Shape Recognition</Badge>
                <Badge variant="outline">Cognitive Focus</Badge>
                <Badge variant="outline">Processing Speed</Badge>
              </div>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} variant="outline" size="lg"><RotateCcw className="h-5 w-5 mr-2" />Play Again</Button>
              <Button onClick={onBack} variant="hero" size="lg">Back to Games</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 gradient-card shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-2xl font-bold">Find the Shadow</h1>
              <p className="text-muted-foreground">Match objects with their shadows</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Level {level}/{rounds.length}</Badge>
            <Badge variant="outline" className="flex items-center gap-2"><Target className="h-4 w-4" />{score} pts</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-8 gradient-card shadow-emotion">
        <div className="space-y-8 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Find the shadows of the object above</h2>
            <p className="text-muted-foreground mb-6">Click the shadow that matches the colored object</p>
          </div>

          {/* Object to match */}
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-lg shadow-soft border-2 border-dashed border-muted">
              <img src={rounds[level-1].src} alt="Object" className="w-48 h-48 object-contain"
                   style={{ transform: `${target.flip ? 'scaleX(-1) ' : ''}rotate(${target.angle}deg)` }} />
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {options.map(opt => (
              <button key={opt.id} onClick={() => onPick(opt.id)} disabled={showResult}
                className={`aspect-square bg-[#0f1115] rounded-xl shadow-soft hover:scale-105 transition-bounce relative overflow-hidden
                ${picked === opt.id ? (opt.correct ? 'ring-4 ring-green-500' : 'ring-4 ring-red-500') : 'hover:ring-2 hover:ring-primary'}
                ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={rounds[level-1].src} alt="shadow"
                    className="object-contain w-28 h-28 md:w-32 md:h-32 opacity-80 grayscale"
                    style={{ transform: `${opt.transform.flip ? 'scaleX(-1) ' : ''}rotate(${opt.transform.angle}deg)` }} />
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="space-y-4">
              <div className={`text-xl font-bold ${options.find(o=>o.id===picked)?.correct ? 'text-green-600' : 'text-red-600'}`}>
                {options.find(o=>o.id===picked)?.correct ? 'Correct! +100 points' : 'Incorrect. Try again!'}
              </div>
              <Button onClick={next} variant="hero" size="lg" className="shadow-glow">{level >= rounds.length ? 'View Results' : 'Next Level'}</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShadowGame;
