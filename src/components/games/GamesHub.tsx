import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Eye, 
  Layers, 
  Users, 
  Globe,
  ArrowLeft,
  Trophy,
  Target,
  Zap,
  Star
} from "lucide-react";
import { PerceptionTest } from "./PerceptionTest";
import { ShadowGame } from "./ShadowGame";
import { FlashcardGame } from "./FlashcardGame";
import { WorldExplorer } from "./WorldExplorer";

interface GamesHubProps {
  onNavigate: (tab: string) => void;
}

export const GamesHub = ({ onNavigate }: GamesHubProps) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'perception',
      title: 'Perception Test',
      description: 'Test your visual perception with optical illusions',
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
      difficulty: 'Easy',
      duration: '2-3 min',
      skills: ['Perception', 'Awareness']
    },
    {
      id: 'shadow',
      title: 'Find the Shadow',
      description: 'Match objects with their correct shadows',
      icon: Layers,
      color: 'from-purple-500 to-purple-600',
      difficulty: 'Medium',
      duration: '3-5 min',
      skills: ['Focus', 'Attention']
    },
    {
      id: 'flashcard',
      title: 'Emotional Situations',
      description: 'Practice empathy with social scenario flashcards',
      icon: Users,
      color: 'from-green-500 to-green-600',
      difficulty: 'Medium',
      duration: '5-10 min',
      skills: ['Empathy', 'Social Intelligence']
    },
    {
      id: 'world',
      title: 'World Explorer',
      description: 'Guess locations from Street View panoramas',
      icon: Globe,
      color: 'from-orange-500 to-orange-600',
      difficulty: 'Hard',
      duration: '10-15 min',
      skills: ['Observation', 'Cultural Awareness']
    }
  ];

  const renderGame = () => {
    switch (activeGame) {
      case 'perception':
        return <PerceptionTest onBack={() => setActiveGame(null)} />;
      case 'shadow':
        return <ShadowGame onBack={() => setActiveGame(null)} />;
      case 'flashcard':
        return <FlashcardGame onBack={() => setActiveGame(null)} />;
      case 'world':
        return <WorldExplorer onBack={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return renderGame();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-8 gradient-card shadow-emotion text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/10" />
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full gradient-wellness shadow-glow">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            EQ Games Hub
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enhance your emotional intelligence through interactive games designed to improve 
            perception, empathy, focus, and cultural awareness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="hero"
              onClick={() => setActiveGame('perception')}
              className="text-lg px-8 py-3"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Playing
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="text-lg px-8 py-3"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Progress
            </Button>
          </div>
        </div>
      </Card>

      {/* Games Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card 
                key={game.id} 
                className="p-6 gradient-card shadow-emotion hover:scale-105 transition-bounce cursor-pointer group"
                onClick={() => setActiveGame(game.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} shadow-soft`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-smooth">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {game.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      <span>{game.duration}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {game.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('home')}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};