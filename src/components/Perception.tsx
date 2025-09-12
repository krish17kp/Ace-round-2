import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Brain, Lightbulb, RotateCcw, Award } from "lucide-react";

import appleIllusion from "@/assets/apple-illusion.png";
import silhouettes from "@/assets/shadow-silhouettes.png";

type Level = {
  image: string;
  question: string;
  answers: { id: string; label: string }[];
  insights: Record<string, string>;
};

const levels: Record<number, Level> = {
  1: {
    image: appleIllusion,
    question: "What did you see first in the image?",
    answers: [
      { id: "apple", label: "An Apple" },
      { id: "faces", label: "Two Faces" },
      { id: "other", label: "Something Else" },
    ],
    insights: {
      apple:
        "You focus on the central, obvious elements first. You are detail‑oriented and systematic.",
      faces:
        "You notice human elements first — strong social awareness and emotional intelligence.",
      other:
        "Your perspective is unique. You think creatively and adapt flexibly.",
    },
  },
  2: {
    image: silhouettes,
    question: "Look again — what do you see first here?",
    answers: [
      { id: "hat", label: "A Hat" },
      { id: "teapot", label: "A Teapot" },
      { id: "briefcase", label: "A Briefcase" },
    ],
    insights: {
      hat: "You latch onto distinct outlines quickly — strong figure–ground perception.",
      teapot: "You identify functional forms early — analytical with attention to detail.",
      briefcase: "You spot practical objects first — organized and goal‑oriented.",
    },
  },
  3: {
    image:
      "https://img.jagranjosh.com/images/2022/June/2862022/OpticalIllusionoldyoungwoman.jpg",
    question: "What do you notice first in this portrait?",
    answers: [
      { id: "young", label: "A Young Woman" },
      { id: "old", label: "An Old Woman" },
      { id: "both", label: "Both Women" },
    ],
    insights: {
      young:
        "Perceiving the young woman first suggests a youthful, optimistic outlook.",
      old:
        "Seeing the old woman first may indicate a more cautious and analytical perspective.",
      both:
        "Identifying both figures shows balanced perception and cognitive flexibility.",
    },
  },
  4: {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDF35QDXJI-jwiNYHsZQZ9dVbXN8_7Qm6aqQ&s",
    question: "What is the most prominent shape you see?",
    answers: [
      { id: "triangle", label: "A White Triangle" },
      { id: "circles", label: "Three Pac-Men" },
      { id: "lines", label: "Lines and Angles" },
    ],
    insights: {
      triangle:
        "Seeing the implied white triangle shows strong pattern completion and problem solving.",
      circles:
        "Focusing on the components indicates a detail‑oriented, analytical approach.",
      lines:
        "Perceiving lines/angles first suggests a literal, data‑driven mindset.",
    },
  },
  5: {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuYTv8yDtDflaP54-0c9efsFzju67eESvtog&s",
    question: "Which way is the dancer spinning?",
    answers: [
      { id: "clockwise", label: "Clockwise" },
      { id: "counter", label: "Counter‑clockwise" },
      { id: "both", label: "I can make it switch" },
    ],
    insights: {
      clockwise:
        "Often associated with right‑brain processing — intuitive and creative.",
      counter:
        "Often linked to left‑brain processing — logical and analytical.",
      both:
        "Being able to switch suggests strong cognitive control and flexibility.",
    },
  },
};

interface PerceptionTestProps {
  onBack: () => void;
}

export const PerceptionTest = ({ onBack }: PerceptionTestProps) => {
  const [level, setLevel] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<"playing" | "result" | "finished">("playing");

  const data = levels[level];

  const onAnswer = (id: string) => {
    setSelected(id);
    setState("result");
  };

  const next = () => {
    if (level < Object.keys(levels).length) {
      setLevel((l) => l + 1);
      setSelected(null);
      setState("playing");
    } else {
      setState("finished");
    }
  };

  const reset = () => {
    setLevel(1);
    setSelected(null);
    setState("playing");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 gradient-card shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Perception Test</h1>
              <p className="text-muted-foreground">Level {level} of {Object.keys(levels).length}</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Perception
          </Badge>
        </div>
      </Card>

      <Card className="p-8 gradient-card shadow-emotion text-center">
        {state === "finished" ? (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Test Complete!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nice work. You explored how the brain fills gaps, prioritizes details, and flips perspectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" /> Play Again
              </Button>
              <Button onClick={onBack} variant="hero" size="lg">Back to Games</Button>
            </div>
          </div>
        ) : state === "result" ? (
          <div className="space-y-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Your Perception Profile</h2>
              <p className="text-xl text-muted-foreground">
                You saw: <span className="font-semibold text-primary">{data.answers.find(a => a.id === selected)?.label}</span>
              </p>
            </div>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-2">Psychological Insight</h3>
                  <p className="text-muted-foreground">
                    {selected && data.insights[selected]}
                  </p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center">
              <Button onClick={next} variant="hero" size="lg">
                {level === Object.keys(levels).length ? "Finish Test" : "Next Level"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">{data.question}</h2>
              <p className="text-muted-foreground mb-8">Trust your first instinct. What catches your eye immediately?</p>
            </div>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img src={data.image} alt="Optical illusion" className="max-w-xs md:max-w-sm h-auto object-contain rounded-lg shadow-soft border bg-white p-2" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {data.answers.map((a) => (
                <Button key={a.id} variant="outline" size="lg" className="h-16 text-lg" onClick={() => onAnswer(a.id)}>
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PerceptionTest;

