import { useState, useEffect } from "react";

// --- Mock UI Components & Icons (for standalone functionality) ---
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`border rounded-xl shadow-sm bg-white ${className}`}>{children}</div>;
const Button = ({ className, variant, size, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    const sizeClasses = { lg: "h-16 px-6 text-lg", default: "h-10 px-4" };
    const variantClasses = {
        hero: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
        outline: "border border-gray-300 bg-white hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
    };
    return <button {...props} className={`${base} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}>{children}</button>;
};
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{children}</div>;
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const Target = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const RotateCcw = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const Trophy = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

// --- SVG SHAPES FOR SHADOWS ---
const SHADOW_SVG_PATHS = {
    sock: <path d="M12.4 12.82c-.08-.09-.16-.18-.24-.28a2.5 2.5 0 0 0-3.32-3.32c-.1-.08-.19-.16-.28-.24a2.5 2.5 0 0 0-3.32-3.32c-.28-.23-.59-.42-.92-.56-.32-.14-.66-.23-1.02-.28-.36-.05-.72-.06-1.08-.02a5.5 5.5 0 0 0-4.04 4.04c-.04.36-.03.72.02 1.08.05.36.14.7.28 1.02.14.33.33.64.56.92a2.5 2.5 0 0 0 3.32 3.32c.09.08.18.16.28.24a2.5 2.5 0 0 0 3.32 3.32c.23.28.42.59.56.92.14.32.23.66.28 1.02.05.36.06.72.02 1.08a5.5 5.5 0 0 0 4.04 4.04c.36.04.72.03 1.08-.02.36-.05.7-.14 1.02-.28.33-.14.64-.33.92-.56a2.5 2.5 0 0 0 3.32-3.32c.08-.09.16-.18.24-.28a2.5 2.5 0 0 0 3.32-3.32c.28-.23.59-.42.92-.56.32-.14.66-.23 1.02-.28.36-.05.72-.06 1.08-.02a5.5 5.5 0 0 0 4.04-4.04c.04-.36.03-.72-.02-1.08a4.5 4.5 0 0 0-1.84-2.76" />,
    apple: <path d="M12 20.9a9.5 9.5 0 0 1-5.12-1.62A8.8 8.8 0 0 1 3.2 13.52c0-3.08 2.3-5.38 5.6-6.44.88-1.5 2.8-2.9 4.96-2.9h.08c2.12 0 4.04 1.4 4.92 2.9 3.32 1.06 5.6 3.36 5.6 6.44a8.8 8.8 0 0 1-3.68 5.76A9.5 9.5 0 0 1 12 20.9z M12 4.1a2 2 0 0 0-2 2c0 1.1-.9 2-2 2s-2-.9-2-2a6 6 0 0 1 6-6h.2c1.6 0 3.2.9 4.1 2.3.2.4.1.9-.3 1.1s-.9.1-1.1-.3A3.9 3.9 0 0 0 14.1 4a2 2 0 0 0-2.1-.1z"/>,
    car: <path d="M19.38 8.35a1 1 0 0 0-.8-.35H5.42a1 1 0 0 0-.8.35L2 14v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1h10v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5l-2.62-5.65zM6 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM4.6 11l1.2-3h12.4l1.2 3H4.6z"/>,
    tree: <path d="M12 22a2 2 0 0 0 2-2v-3h-4v3a2 2 0 0 0 2 2z M19 12a7 7 0 1 0-14 0c0 3.3 2.4 6.1 5.5 6.8V17h3v-1.2c3.1-.7 5.5-3.5 5.5-6.8z M12 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>,
    house: <path d="M20 10.5v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10.5l8-8 8 8z M10 18h4v-4h-4v4z"/>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.25l-6.18 3.77L7 14.14l-5-4.87 6.91-1.01L12 2z"/>,
    key: <path d="M13.5 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z m-4 4a6 6 0 1 1 7.1 5.1l5.4 5.4a1 1 0 0 1-1.4 1.4l-5.4-5.4A6 6 0 0 1 9.5 6.5z m-3 3a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1z"/>,
    boat: <path d="M21.5 16.9L13 21.4a2 2 0 0 1-2 0l-8.5-4.5A2 2 0 0 1 1 15V8.1a2 2 0 0 1 1-1.7l8.5-4.5a2 2 0 0 1 2 0l8.5 4.5a2 2 0 0 1 1 1.7V15a2 2 0 0 1-1.5 1.9z M4 9.1l8 4.2 8-4.2-8-4.2-8 4.2z m1 9.3l7 3.7v-8.2l-7-3.7v8.2z"/>,
    mug: <path d="M18 5h-6a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4zm-6 12a2 2 0 0 1-2-2v-1h2v3zm8 0h-2v-3h2a2 2 0 0 1 2 2v1zM6 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"/>
};

// --- Game Data: 5 Levels with colors for SVGs ---
const LEVEL_DATA = [
    { name: "Sock", color: "text-red-500", correctShadow: SHADOW_SVG_PATHS.sock },
    { name: "Apple", color: "text-red-600", correctShadow: SHADOW_SVG_PATHS.apple },
    { name: "Car", color: "text-blue-500", correctShadow: SHADOW_SVG_PATHS.car },
    { name: "Tree", color: "text-green-500", correctShadow: SHADOW_SVG_PATHS.tree },
    { name: "House", color: "text-orange-500", correctShadow: SHADOW_SVG_PATHS.house },
];

const ALL_SHADOWS = Object.values(SHADOW_SVG_PATHS);

interface ShadowOption {
    id: number;
    svg: JSX.Element;
    correct: boolean;
}

interface PerceptionTestProps {
  onBack: () => void;
}

export const ShadowGame = ({ onBack }: PerceptionTestProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedShadowId, setSelectedShadowId] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [levelOptions, setLevelOptions] = useState<ShadowOption[]>([]);

  const currentLevelData = LEVEL_DATA[currentLevel - 1];

  useEffect(() => {
    const correctShadow = currentLevelData.correctShadow;
    const distractors = ALL_SHADOWS.filter(svg => svg !== correctShadow);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, 5);
    
    const options: Omit<ShadowOption, 'id'>[] = [
      { svg: correctShadow, correct: true },
      ...selectedDistractors.map(svg => ({ svg, correct: false }))
    ];

    const finalOptions = [...options]
        .sort(() => 0.5 - Math.random())
        .map((opt, index) => ({ ...opt, id: index }));

    setLevelOptions(finalOptions);
  }, [currentLevel, currentLevelData]);
  
  const handleShadowClick = (shadow: ShadowOption) => {
    setSelectedShadowId(shadow.id);
    setShowResult(true);
    if (shadow.correct) {
      setScore(prev => prev + 100);
    }
  };

  const nextLevel = () => {
    if (currentLevel >= LEVEL_DATA.length) {
      setGameComplete(true);
    } else {
      setCurrentLevel(prev => prev + 1);
      setSelectedShadowId(null);
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setSelectedShadowId(null);
    setShowResult(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-center">Game Complete!</h1>
        </Card>
        <Card className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Excellent Focus!</h2>
            <p className="text-gray-500 mb-6">Final Score: <span className="font-bold text-blue-600">{score} points</span></p>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline" size="lg"><RotateCcw className="h-5 w-5 mr-2" /> Play Again</Button>
              <Button onClick={onBack} variant="hero" size="lg">Back to Games</Button>
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-2xl font-bold">Find the Shadow</h1>
              <p className="text-gray-500">Level {currentLevel}/{LEVEL_DATA.length}</p>
            </div>
          </div>
          <Badge className="flex items-center gap-2"><Target className="h-4 w-4" />{score} pts</Badge>
        </div>
      </Card>

      <Card className="p-8">
        <div className="space-y-8 text-center">
          <h2 className="text-2xl font-bold">Which shadow below matches this object?</h2>
          <div className="flex justify-center">
            {/* --- FIX: Replaced problematic <img> with a reliable, colored SVG --- */}
            <div className="p-4 bg-white rounded-lg shadow-md border-2 border-dashed">
              <svg viewBox="0 0 24 24" className={`w-24 h-24 ${currentLevelData.color}`} fill="currentColor">
                  {currentLevelData.correctShadow}
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {levelOptions.map((shadow) => (
              <button
                key={shadow.id}
                onClick={() => !showResult && handleShadowClick(shadow)}
                disabled={showResult}
                className={`
                  aspect-square bg-gray-100 rounded-lg shadow-inner hover:scale-105 transition-transform duration-200
                  flex items-center justify-center p-4
                  ${selectedShadowId === shadow.id 
                    ? (shadow.correct ? 'ring-4 ring-green-500' : 'ring-4 ring-red-500')
                    : 'hover:ring-2 hover:ring-blue-500'
                  }
                  ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-gray-800" fill="currentColor">
                    {shadow.svg}
                </svg>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="space-y-4 animate-fade-in">
                <p className={`text-xl font-bold ${levelOptions.find(s => s.id === selectedShadowId)?.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {levelOptions.find(s => s.id === selectedShadowId)?.correct ? 'Correct! +100 points' : 'Not quite!'}
                </p>
              <Button onClick={nextLevel} variant="hero" size="lg">
                {currentLevel >= LEVEL_DATA.length ? 'View Results' : 'Next Level'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

