import React, { useState, useEffect } from "react";

// --- UI Components ---
const Card = ({ className, children }) => (
  <div className={`border rounded-xl shadow-sm bg-white ${className}`}>{children}</div>
);
const Button = ({ className, variant, size, children, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-transform duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none";
  const sizeClasses = { icon: "h-10 w-10", lg: "h-12 px-8 text-base", default: "h-10 px-4 py-2" };
  const variantClasses = {
    hero: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    default: "",
  };
  return (
    <button
      {...props}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {children}
    </button>
  );
};
const Badge = ({ className, children }) => (
  <div
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
  >
    {children}
  </div>
);

// --- SVG Icons ---
const ArrowLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const Trophy = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const RotateCcw = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

// --- Location Data ---
const LOCATIONS = [
  { location: "Mukesh Patel School of Technology, Mumbai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMXt3i407g9JsjuaoMRpd1xSK-9oR5nP4xew&s" },
  { location: "NMIMS University Main Gate, Vile Parle", image: "https://www.nmims.edu/images/home-slide/m-school-1.jpg" },
  { location: "Gateway of India, Mumbai", image: "https://lp-cms-production.imgix.net/2019-06/bbc886323ff07d295157ea35f423e121-gateway-of-india.jpg" },
  { location: "Juhu Beach, Mumbai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOk-fFj9pzK2gsliVN0Z9Ff-A9LA_oxxiwRQ&s" },
  { location: "Marine Drive, Mumbai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX6KbRVFYtYBiPlvbXghwjMVi8tEm6QzDdeg&s" },
  { location: "Siddhivinayak Temple, Prabhadevi", image: "https://www.mapsofindia.com/ci-moi-images/my-india/siddhivinayak-temple-mumbai.jpg" },
];

const shuffleAndPick = (arr, num) => [...arr].sort(() => 0.5 - Math.random()).slice(0, num);

// --- Game Component ---
export const WorldExplorer = ({ onBack }) => {
  const [gameState, setGameState] = useState("playing");
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [guessText, setGuessText] = useState("");

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    setRounds(shuffleAndPick(LOCATIONS, 5));
    setCurrentRound(0);
    setTotalScore(0);
    setGameState("playing");
    setRoundResult(null);
    setGuessText("");
  };

  const handleGuess = () => {
    const actual = rounds[currentRound].location.toLowerCase();
    const guess = guessText.trim().toLowerCase();

    const isCorrect = actual.includes(guess) || guess.includes(actual);
    const score = isCorrect ? 5000 : 1000;

    setTotalScore((prev) => prev + score);
    setRoundResult({ correct: isCorrect, score, correctAnswer: rounds[currentRound].location });
    setGameState("round-result");
  };

  const nextRound = () => {
    if (currentRound >= 4) {
      setGameState("game-over");
    } else {
      setCurrentRound((prev) => prev + 1);
      setGameState("playing");
      setRoundResult(null);
      setGuessText("");
    }
  };

  // --- Render ---
  if (gameState === "game-over") {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Game Over!</h1>
            <Badge>
              <Trophy className="h-4 w-4 mr-2" /> Total Score: {totalScore.toLocaleString()}
            </Badge>
          </div>
        </Card>
        <Card className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold mb-2">Final Score: {totalScore.toLocaleString()}</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {totalScore >= 20000
              ? "Amazing! You're a true Mumbaikar!"
              : totalScore >= 15000
              ? "Great job! You know your way around the city."
              : "Good effort! Keep exploring to sharpen your skills."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" /> Play Again
            </Button>
            <Button onClick={onBack} variant="hero" size="lg">
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentLoc = rounds[currentRound];
  if (!currentLoc) return <div className="text-center p-8 text-gray-600">Loading Game...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Mumbai Explorer (Demo)</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge>Round {currentRound + 1}/5</Badge>
            <Badge>
              <Trophy className="h-4 w-4 mr-1" />
              {totalScore.toLocaleString()}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Street View */}
        <Card className="p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <span className="text-blue-500">📷</span> Street View
          </h3>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
            <img
              key={currentLoc.image}
              src={currentLoc.image}
              alt={currentLoc.location}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found";
              }}
            />
          </div>
        </Card>

        {/* Guess Input */}
        <Card className="p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">✍️ Type Your Guess</h3>
          <input
            type="text"
            placeholder="Enter location name..."
            value={guessText}
            onChange={(e) => setGuessText(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {gameState === "playing" && (
            <Button onClick={handleGuess} disabled={!guessText.trim()} className="w-full" size="lg" variant="hero">
              Submit Guess
            </Button>
          )}

          {gameState === "round-result" && roundResult && (
            <div className="text-center p-4 bg-blue-50 rounded-lg animate-fade-in">
              {roundResult.correct ? (
                <p className="text-green-600 font-bold">✅ Correct! +{roundResult.score} points</p>
              ) : (
                <p className="text-red-600 font-bold">❌ Wrong! +{roundResult.score} points</p>
              )}
              <p className="text-sm mt-2">
                Correct answer: <strong>{roundResult.correctAnswer}</strong>
              </p>
              <Button onClick={nextRound} className="w-full mt-4" size="lg" variant="hero">
                {currentRound >= 4 ? "View Final Results" : "Next Round"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorldExplorer;
