import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers, Target, RotateCcw, Trophy } from "lucide-react";
import gameSock from "@/assets/game-sock.png";

interface PerceptionTestProps {
  onBack: () => void;
}

export const ShadowGame = ({ onBack }: PerceptionTestProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedShadow, setSelectedShadow] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const shadows = [
    { id: 1, correct: false, shape: "cube" },
    { id: 2, correct: false, shape: "apple" },
    { id: 3, correct: true, shape: "sock" }, // This matches our sock image
    { id: 4, correct: false, shape: "hat" },
    { id: 5, correct: false, shape: "briefcase" },
    { id: 6, correct: false, shape: "teapot" },
    { id: 7, correct: false, shape: "bottle" },
    { id: 8, correct: false, shape: "book" },
    { id: 9, correct: false, shape: "scissors" }
  ];

  const handleShadowClick = (shadowId: number) => {
    const shadow = shadows.find(s => s.id === shadowId);
    setSelectedShadow(shadowId);
    setShowResult(true);
    
    if (shadow?.correct) {
      setScore(prev => prev + 100);
    }
  };

  const nextLevel = () => {
    if (currentLevel >= 5) {
      setGameComplete(true);
    } else {
      setCurrentLevel(prev => prev + 1);
      setSelectedShadow(null);
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setSelectedShadow(null);
    setShowResult(false);
    setGameComplete(false);
  };

  if (gameComplete) {
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
                <h1 className="text-2xl font-bold">Game Complete!</h1>
                <p className="text-muted-foreground">Shadow matching results</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Final Score: {score}
            </Badge>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-8 gradient-card shadow-emotion text-center">
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Excellent Focus!</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Final Score: <span className="font-bold text-primary">{score} points</span>
              </p>
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
              <Button onClick={resetGame} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Play Again
              </Button>
              <Button onClick={onBack} variant="hero" size="lg">
                Back to Games
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Find the Shadow</h1>
              <p className="text-muted-foreground">Match objects with their shadows</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Level {currentLevel}/5</Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {score} pts
            </Badge>
          </div>
        </div>
      </Card>

      {/* Game Content */}
      <Card className="p-8 gradient-card shadow-emotion">
        <div className="space-y-8 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Find the shadows of the object above</h2>
            <p className="text-muted-foreground mb-8">
              Click on the shadow that matches the colored object
            </p>
          </div>

          {/* Object to Match */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white rounded-lg shadow-soft border-2 border-dashed border-muted">
              <img 
                src={gameSock} 
                alt="Object to match" 
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          {/* Shadow Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {shadows.map((shadow) => (
              <button
                key={shadow.id}
                onClick={() => !showResult && handleShadowClick(shadow.id)}
                disabled={showResult}
                className={`
                  aspect-square bg-gray-800 rounded-lg shadow-soft hover:scale-105 transition-bounce
                  relative overflow-hidden
                  ${selectedShadow === shadow.id 
                    ? (shadow.correct ? 'ring-4 ring-green-500' : 'ring-4 ring-red-500')
                    : 'hover:ring-2 hover:ring-primary'
                  }
                  ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Shadow silhouette - simplified representation */}
                <div className="absolute inset-4 bg-black rounded opacity-80 flex items-center justify-center">
                  <div className="text-white text-xs">
                    {shadow.shape === 'sock' ? '👟' : 
                     shadow.shape === 'cube' ? '⬛' :
                     shadow.shape === 'apple' ? '🍎' :
                     shadow.shape === 'hat' ? '🎩' :
                     shadow.shape === 'briefcase' ? '💼' :
                     shadow.shape === 'teapot' ? '🫖' :
                     shadow.shape === 'bottle' ? '🍼' :
                     shadow.shape === 'book' ? '📖' : '✂️'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div className="space-y-4">
              <div className={`text-xl font-bold ${shadows.find(s => s.id === selectedShadow)?.correct ? 'text-green-600' : 'text-red-600'}`}>
                {shadows.find(s => s.id === selectedShadow)?.correct ? 'Correct! +100 points' : 'Incorrect. Try again!'}
              </div>
              
              <Button 
                onClick={nextLevel}
                variant="hero"
                size="lg"
                className="shadow-glow"
              >
                {currentLevel >= 5 ? 'View Results' : 'Next Level'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};