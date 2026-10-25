import React, { useState } from "react";

// --- Mock UI Components & Icons (for standalone functionality) ---
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`border rounded-xl shadow-sm bg-white ${className}`}>{children}</div>;
const Button = ({ className, variant, size, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    const sizeClasses = { lg: "h-16 px-6 text-lg", default: "h-10 px-4" };
    const variantClasses = {
        hero: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
        outline: "border border-gray-300 bg-white hover:bg-gray-100 hover:scale-105",
        ghost: "hover:bg-gray-100",
    };
    return <button {...props} className={`${base} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}>{children}</button>;
};
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{children}</div>;
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const Eye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Brain = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v4a4 4 0 1 0 8 0V6a4 4 0 0 0-4-4Z"/><path d="M12 12a4 4 0 1 0 4 4"/><path d="M12 12a4 4 0 1 1 4 4"/><path d="M12 12a4 4 0 1 0-4 4"/><path d="M12 12a4 4 0 1 1-4 4"/><path d="M12 12a4 4 0 1 0 4-4"/><path d="M12 12a4 4 0 1 1 4-4"/><path d="M12 12a4 4 0 1 0-4-4"/><path d="M12 12a4 4 0 1 1-4-4"/></svg>;
const Lightbulb = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S9.8 3.3 9 5.5"/><path d="M12 14v4"/><path d="M12 22a2.5 2.5 0 0 1-2.5-2.5c0-.8.4-1.5.9-2"/><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17h2a2.5 2.5 0 0 0 2.5-2.5c0-.8-.4-1.5-.9-2"/></svg>;
const RotateCcw = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const Award = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"/></svg>;


// --- Game Data: 5 Levels of Illusions ---
const levels = {
  1: {
    image: "https://static.toiimg.com/thumb/msid-120929680,width-1280,height-720,resizemode-4/120929680.jpg",
    question: "What's the first thing you see in this image?",
    answers: [
      { id: "vase", label: "A Vase" },
      { id: "faces", label: "Two Faces" },
      { id: "both", label: "Both at once" },
    ],
    insights: {
      vase: "Seeing the vase first suggests you have a tendency to focus on the overall structure and objects in a scene. You might be a holistic, big-picture thinker.",
      faces: "Noticing the faces first indicates a strong attunement to people and social cues. You are likely naturally drawn to human interaction and emotion.",
      both: "Perceiving both simultaneously shows high cognitive flexibility. Your mind can quickly switch between perspectives and hold competing ideas at once.",
    },
  },
  2: {
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Duck-Rabbit_illusion.jpg",
    question: "Which animal appears to you first?",
    answers: [
      { id: "duck", label: "A Duck" },
      { id: "rabbit", label: "A Rabbit" },
      { id: "neither", label: "Something Else" },
    ],
    insights: {
      duck: "Seeing the duck first is more common when reading left-to-right. It suggests you're a creative, imaginative person who sees the world in a unique way.",
      rabbit: "Spotting the rabbit first suggests a more fact-based, logical approach to problems. You may be more inclined to see what is directly in front of you.",
      neither: "Your unique perspective allows you to see beyond the obvious choices, highlighting a strong sense of individuality and creative interpretation.",
    },
  },
  3: {
    image: "https://img.jagranjosh.com/images/2022/June/2862022/OpticalIllusionoldyoungwoman.jpg",
    question: "What do you notice first in this portrait?",
    answers: [
      { id: "young", label: "A Young Woman" },
      { id: "old", label: "An Old Woman" },
      { id: "both", label: "Both Women" },
    ],
    insights: {
      young: "Perceiving the young woman first suggests a youthful, optimistic outlook. You tend to focus on new opportunities and the positive aspects of a situation.",
      old: "Seeing the old woman first may indicate a more cautious, experienced, and analytical perspective. You tend to consider the full context and potential challenges.",
      both: "The ability to quickly identify both figures demonstrates a sophisticated and balanced perceptual ability, capable of seeing multiple viewpoints.",
    },
  },
  4: {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDF35QDXJI-jwiNYHsZQZ9dVbXN8_7Qm6aqQ&s",
    question: "What is the most prominent shape you see?",
    answers: [
      { id: "triangle", label: "A White Triangle" },
      { id: "circles", label: "Three Pac-Men" },
      { id: "lines", label: "Lines and Shapes" },
    ],
    insights: {
      triangle: "Seeing the white triangle (which isn't actually there) shows your brain is excellent at filling in the gaps and seeing patterns. This is a sign of strong problem-solving skills.",
      circles: "Focusing on the 'Pac-Man' shapes indicates a detail-oriented approach. You tend to analyze the individual components of a system before seeing the whole.",
      lines: "Perceiving the individual lines and angles suggests a highly analytical and literal mindset, focusing on concrete data rather than abstract interpretations.",
    },
  },
  5: {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuYTv8yDtDflaP54-0c9efsFzju67eESvtog&s",
    question: "Which way is the dancer spinning?",
    answers: [
      { id: "clockwise", label: "Clockwise" },
      { id: "counter", label: "Counter-Clockwise" },
      { id: "both", label: "I can make her switch" },
    ],
    insights: {
      clockwise: "Seeing a clockwise spin is often associated with right-brain dominance, suggesting you might be more creative, intuitive, and emotionally expressive.",
      counter: "A counter-clockwise spin is often linked to left-brain dominance, indicating strong logical, analytical, and language-processing skills.",
      both: "If you can consciously switch the direction, it demonstrates a remarkable balance between both hemispheres of your brain and high cognitive control.",
    },
  },
};

interface PerceptionTestProps {
  onBack: () => void;
}

export const PerceptionTest = ({ onBack }: PerceptionTestProps) => {
  const [level, setLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"playing" | "result" | "finished">("playing");

  const currentLevelData = levels[level];

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    setGameState("result");
  };

  const handleNextLevel = () => {
    if (level < Object.keys(levels).length) {
      setLevel(prev => prev + 1);
      setSelectedAnswer(null);
      setGameState("playing");
    } else {
      setGameState("finished");
    }
  };

  const resetGame = () => {
    setLevel(1);
    setSelectedAnswer(null);
    setGameState("playing");
  };

  const renderContent = () => {
    if (gameState === "finished") {
      return (
        <div className="text-center space-y-8 animate-fade-in">
          <Award className="h-16 w-16 mx-auto text-yellow-500" />
          <h2 className="text-3xl font-bold">Test Complete!</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            You've explored the fascinating world of perception. Your brain's ability to interpret and create meaning is truly powerful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetGame} variant="outline" size="lg"><RotateCcw className="h-5 w-5 mr-2" /> Play Again</Button>
            <Button onClick={onBack} variant="hero" size="lg">Back to Games</Button>
          </div>
        </div>
      );
    }

    if (gameState === "result") {
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-blue-100 shadow-lg">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Your Perception Profile</h2>
            <p className="text-xl text-gray-600 mb-2">
              You saw: <span className="font-semibold text-blue-600">
                {currentLevelData.answers.find(a => a.id === selectedAnswer)?.label}
              </span>
            </p>
          </div>
          <Card className="p-6 bg-gray-50 border">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-2">Psychological Insight</h3>
                <p className="text-gray-600">
                  {selectedAnswer && currentLevelData.insights[selectedAnswer]}
                </p>
              </div>
            </div>
          </Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNextLevel} variant="hero" size="lg">
              {level === Object.keys(levels).length ? "Finish Test" : "Next Level"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold mb-4">{currentLevelData.question}</h2>
          <p className="text-gray-500 mb-8">
            Trust your first instinct. What catches your eye immediately?
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              key={level} // Add key to force re-render on level change
              src={currentLevelData.image} 
              alt="Optical illusion" 
              className="max-w-xs md:max-w-sm h-auto object-contain rounded-lg shadow-lg border bg-white p-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {currentLevelData.answers.map((answer) => (
            <Button
              key={answer.id}
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(answer.id)}
            >
              {answer.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Perception Test</h1>
              <p className="text-gray-500">Level {level} of {Object.keys(levels).length}</p>
            </div>
          </div>
          <Badge className="flex items-center gap-2 border-gray-300">
            <Eye className="h-4 w-4" />
            Perception
          </Badge>
        </div>
      </Card>
      <Card className="p-8 bg-gray-50 text-center min-h-[600px] flex items-center justify-center">
        {renderContent()}
      </Card>
    </div>
  );
};
