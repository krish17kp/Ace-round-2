import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Brain, Lightbulb } from "lucide-react";
import appleIllusion from "@/assets/apple-illusion.png";

interface PerceptionTestProps {
  onBack: () => void;
}

export const PerceptionTest = ({ onBack }: PerceptionTestProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const answers = [
    { id: 'apple', label: 'An Apple' },
    { id: 'faces', label: 'Two Faces' },
    { id: 'other', label: 'Something Else' }
  ];

  const insights = {
    apple: "You tend to focus on the central, obvious elements first. This suggests you're detail-oriented and prefer to process information systematically. This approach can be very effective in analytical tasks.",
    faces: "You noticed the human elements first, which indicates strong social awareness and tendency to focus on interpersonal aspects. This suggests you have well-developed social intelligence.",
    other: "Your unique perspective shows creative thinking and the ability to see beyond conventional interpretations. This indicates strong divergent thinking skills and cognitive flexibility."
  };

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowResult(true);
  };

  const resetTest = () => {
    setSelectedAnswer(null);
    setShowResult(false);
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
              <p className="text-muted-foreground">Visual perception and awareness assessment</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Perception
          </Badge>
        </div>
      </Card>

      {/* Game Content */}
      <Card className="p-8 gradient-card shadow-emotion text-center">
        {!showResult ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">What did you see first in the last image?</h2>
              <p className="text-muted-foreground mb-8">
                Look at the image below and trust your first instinct. What catches your eye immediately?
              </p>
            </div>

            {/* Illusion Image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src={appleIllusion} 
                  alt="Optical illusion" 
                  className="w-80 h-80 object-contain rounded-lg shadow-soft border"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent rounded-lg" />
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {answers.map((answer) => (
                <Button
                  key={answer.id}
                  variant="outline"
                  size="lg"
                  className="h-16 text-lg hover:scale-105 transition-bounce"
                  onClick={() => handleAnswer(answer.id)}
                >
                  {answer.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Your Perception Profile</h2>
              <p className="text-xl text-muted-foreground mb-2">
                You saw: <span className="font-semibold text-primary">
                  {answers.find(a => a.id === selectedAnswer)?.label}
                </span>
              </p>
            </div>

            {/* Insight */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-2">Psychological Insight</h3>
                  <p className="text-muted-foreground">
                    {selectedAnswer && insights[selectedAnswer as keyof typeof insights]}
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={resetTest}
                variant="outline"
                size="lg"
              >
                Try Again
              </Button>
              <Button 
                onClick={onBack}
                variant="hero"
                size="lg"
              >
                Back to Games
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};