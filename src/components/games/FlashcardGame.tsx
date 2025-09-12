import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Heart, Brain, RotateCcw, Trophy } from "lucide-react";
import flashcardSad from "@/assets/flashcard-sad.png";

interface FlashcardGameProps {
  onBack: () => void;
}

export const FlashcardGame = ({ onBack }: FlashcardGameProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const flashcards = [
    {
      id: 1,
      image: flashcardSad,
      scenario: "Your colleague looks visibly upset after a team meeting",
      question: "What is the most empathetic way to respond?",
      options: [
        { id: 'a', text: "Ignore them - they'll get over it", correct: false },
        { id: 'b', text: "Ask privately if they're okay and offer to listen", correct: true },
        { id: 'c', text: "Tell them to toughen up", correct: false },
        { id: 'd', text: "Make a joke to lighten the mood", correct: false }
      ],
      explanation: "The best approach is to show genuine concern and offer support privately. This demonstrates empathy while respecting their dignity."
    },
    {
      id: 2,
      image: flashcardSad,
      scenario: "A friend repeatedly cancels plans at the last minute",
      question: "What might they be feeling?",
      options: [
        { id: 'a', text: "They don't value our friendship", correct: false },
        { id: 'b', text: "They might be overwhelmed or struggling", correct: true },
        { id: 'c', text: "They're being selfish", correct: false },
        { id: 'd', text: "They found better plans", correct: false }
      ],
      explanation: "Changes in behavior often indicate underlying stress or challenges. Approaching with understanding rather than judgment strengthens relationships."
    },
    {
      id: 3,
      image: flashcardSad,
      scenario: "Someone interrupts you while you're speaking in a group",
      question: "How should you handle this emotionally intelligent way?",
      options: [
        { id: 'a', text: "Call them out publicly", correct: false },
        { id: 'b', text: "Stay calm and wait for an appropriate moment to continue", correct: true },
        { id: 'c', text: "Interrupt them back", correct: false },
        { id: 'd', text: "Leave the conversation", correct: false }
      ],
      explanation: "Emotional intelligence involves managing your own emotions while considering others' perspectives. Staying calm shows maturity and leadership."
    }
  ];

  const handleAnswer = (optionId: string) => {
    const currentFlashcard = flashcards[currentCard];
    const isCorrect = currentFlashcard.options.find(opt => opt.id === optionId)?.correct;
    
    setSelectedAnswer(optionId);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 100);
    }
  };

  const nextCard = () => {
    if (currentCard >= flashcards.length - 1) {
      setGameComplete(true);
    } else {
      setCurrentCard(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentCard(0);
    setScore(0);
    setSelectedAnswer(null);
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
                <h1 className="text-2xl font-bold">Empathy Assessment Complete!</h1>
                <p className="text-muted-foreground">Your emotional intelligence results</p>
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
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Empathy Score</h2>
              <p className="text-xl text-muted-foreground mb-6">
                You scored: <span className="font-bold text-primary">{score}/{flashcards.length * 100} points</span>
              </p>
              <p className="text-muted-foreground">
                {score >= 250 ? "Excellent empathy skills! You demonstrate strong emotional intelligence." :
                 score >= 150 ? "Good empathy awareness with room for growth." :
                 "Consider practicing more empathetic responses in daily interactions."}
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <h3 className="font-semibold mb-2">Skills Developed</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Emotional Awareness</Badge>
                <Badge variant="outline">Social Intelligence</Badge>
                <Badge variant="outline">Empathy</Badge>
                <Badge variant="outline">Communication</Badge>
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

  const currentFlashcard = flashcards[currentCard];

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
              <h1 className="text-2xl font-bold">Emotional Situations</h1>
              <p className="text-muted-foreground">Practice empathy and social intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Card {currentCard + 1}/{flashcards.length}</Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {score} pts
            </Badge>
          </div>
        </div>
      </Card>

      {/* Flashcard */}
      <Card className="p-8 gradient-card shadow-emotion">
        <div className="space-y-8">
          {/* Scenario Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={currentFlashcard.image} 
                alt="Emotional situation" 
                className="w-80 h-60 object-cover rounded-lg shadow-soft border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg" />
            </div>
          </div>

          {/* Scenario Description */}
          <Card className="p-6 bg-gradient-to-br from-muted/20 to-muted/10 border-muted">
            <h3 className="font-semibold mb-2">Scenario</h3>
            <p className="text-muted-foreground">{currentFlashcard.scenario}</p>
          </Card>

          {/* Question */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">{currentFlashcard.question}</h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFlashcard.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="lg"
                className={`
                  h-auto p-4 text-left whitespace-normal hover:scale-105 transition-bounce
                  ${selectedAnswer === option.id 
                    ? (option.correct ? 'ring-4 ring-green-500 bg-green-50' : 'ring-4 ring-red-500 bg-red-50')
                    : ''
                  }
                `}
                onClick={() => !showResult && handleAnswer(option.id)}
                disabled={showResult}
              >
                <span className="font-medium mr-2">{option.id.toUpperCase()})</span>
                {option.text}
              </Button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div className="space-y-4 text-center">
              <div className={`text-xl font-bold ${
                currentFlashcard.options.find(opt => opt.id === selectedAnswer)?.correct 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {currentFlashcard.options.find(opt => opt.id === selectedAnswer)?.correct 
                  ? 'Correct! +100 points' 
                  : 'Incorrect'
                }
              </div>
              
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20 text-left">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{currentFlashcard.explanation}</p>
                  </div>
                </div>
              </Card>
              
              <Button 
                onClick={nextCard}
                variant="hero"
                size="lg"
                className="shadow-glow"
              >
                {currentCard >= flashcards.length - 1 ? 'View Results' : 'Next Situation'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};