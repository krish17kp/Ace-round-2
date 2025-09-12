import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Globe, MapPin, Trophy, RotateCcw, Eye } from "lucide-react";

interface WorldExplorerProps {
  onBack: () => void;
}

export const WorldExplorer = ({ onBack }: WorldExplorerProps) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  const rounds = [
    {
      id: 1,
      location: "Times Square, New York",
      coords: { lat: 40.7580, lng: -73.9855 },
      description: "A bustling commercial intersection and neighborhood"
    },
    {
      id: 2,
      location: "Eiffel Tower, Paris",
      coords: { lat: 48.8584, lng: 2.2945 },
      description: "Famous iron lattice tower on the Champ de Mars"
    },
    {
      id: 3,
      location: "Shibuya Crossing, Tokyo",
      coords: { lat: 35.6598, lng: 139.7006 },
      description: "One of the busiest pedestrian crossings in the world"
    },
    {
      id: 4,
      location: "Big Ben, London",
      coords: { lat: 51.5007, lng: -0.1246 },
      description: "The nickname for the Great Bell of the clock"
    },
    {
      id: 5,
      location: "Sydney Opera House, Australia",
      coords: { lat: -33.8568, lng: 151.2153 },
      description: "Multi-venue performing arts centre"
    }
  ];

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setHasApiKey(true);
    }
  };

  const calculateScore = (distance: number) => {
    // Score calculation based on distance (closer = higher score)
    if (distance < 50) return 5000;
    if (distance < 200) return 4000;
    if (distance < 500) return 3000;
    if (distance < 1000) return 2000;
    if (distance < 2000) return 1000;
    return 500;
  };

  const nextRound = () => {
    if (currentRound >= 5) {
      setGameComplete(true);
      setShowResults(true);
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentRound(1);
    setTotalScore(0);
    setGameComplete(false);
    setShowResults(false);
  };

  // API Key Input Screen
  if (!hasApiKey) {
    return (
      <div className="space-y-6">
        <Card className="p-6 gradient-card shadow-soft">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">World Explorer Setup</h1>
              <p className="text-muted-foreground">Configure your Google Maps API</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 gradient-card shadow-emotion">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Globe className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Enter Google Maps API Key</h2>
              <p className="text-muted-foreground mb-6">
                To play World Explorer, you need a Google Maps API key with Street View enabled.
                Get yours at <a href="https://developers.google.com/maps" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Maps Platform</a>
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-center"
              />
              
              <Button 
                onClick={handleApiKeySubmit}
                variant="hero"
                size="lg"
                disabled={!apiKey.trim()}
                className="shadow-glow"
              >
                Start Game
              </Button>
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a demo version. In a production environment, 
                the API key would be securely stored on the server side.
              </p>
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  // Game Complete Screen
  if (gameComplete && showResults) {
    return (
      <div className="space-y-6">
        <Card className="p-6 gradient-card shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">World Explorer Complete!</h1>
                <p className="text-muted-foreground">Your global exploration results</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Total: {totalScore}
            </Badge>
          </div>
        </Card>

        <Card className="p-8 gradient-card shadow-emotion text-center">
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full gradient-wellness shadow-glow">
                <Globe className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Global Explorer</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Final Score: <span className="font-bold text-primary">{totalScore.toLocaleString()} points</span>
              </p>
              <p className="text-muted-foreground">
                {totalScore >= 20000 ? "Outstanding! You have excellent observation skills and world knowledge." :
                 totalScore >= 15000 ? "Great job! You demonstrate good geographic awareness." :
                 totalScore >= 10000 ? "Good effort! Continue exploring to improve your skills." :
                 "Keep practicing! World knowledge grows with exploration."}
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <h3 className="font-semibold mb-2">Skills Developed</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Visual Observation</Badge>
                <Badge variant="outline">Geographic Knowledge</Badge>
                <Badge variant="outline">Cultural Awareness</Badge>
                <Badge variant="outline">Critical Thinking</Badge>
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

  // Main Game Interface
  const currentLocation = rounds[currentRound - 1];

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
              <h1 className="text-2xl font-bold">World Explorer</h1>
              <p className="text-muted-foreground">Guess the location from Street View</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Round {currentRound}/5</Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {totalScore.toLocaleString()}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Game Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Street View Panel */}
        <Card className="p-6 gradient-card shadow-emotion">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Street View</h3>
            </div>
            
            {/* Demo Street View Image */}
            <div className="aspect-video bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <p className="text-xl font-semibold mb-2">Street View Demo</p>
                <p className="text-sm opacity-90">
                  Location: {currentLocation.location}
                </p>
                <p className="text-xs mt-2 opacity-75">
                  In the real game, this would show a Google Street View panorama
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Move
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
            </div>
          </div>
        </Card>

        {/* Map and Controls */}
        <Card className="p-6 gradient-card shadow-emotion">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Make Your Guess</h3>
            </div>
            
            {/* Demo World Map */}
            <div className="aspect-video bg-gradient-to-br from-green-400 via-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white relative">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <p className="text-xl font-semibold mb-2">World Map</p>
                <p className="text-sm opacity-90">Click to place your guess</p>
                <p className="text-xs mt-2 opacity-75">
                  In the real game, this would be an interactive world map
                </p>
              </div>
              
              {/* Demo pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Demo Results */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Demo Results:</p>
                <p className="font-semibold">Distance: 1,247 km</p>
                <p className="text-primary font-bold">+2,500 points</p>
              </div>
            </Card>

            <Button 
              onClick={nextRound}
              variant="hero"
              size="lg"
              className="w-full shadow-glow"
            >
              {currentRound >= 5 ? 'View Final Results' : 'Next Round'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};