import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart,
  BookOpen,
  Wind,
  Smile,
  BarChart2,
  CheckSquare,
  Repeat,
  Quote,
  MapPin,
  Globe
} from "lucide-react";

// --- Mock UI Components ---
const Card = ({ className, ...props }) => <div {...props} className={`border rounded-xl shadow-sm bg-white ${className}`} />;
const Button = ({ className, variant, size, ...props }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
    const sizeClasses = { icon: "h-10 w-10", sm: "h-9 px-3", default: "h-10 px-4 py-2" };
    const variantClasses = {
        hero: "bg-indigo-600 text-white hover:bg-indigo-700",
        outline: "border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
    };
    return <button {...props} className={`${base} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || 'bg-indigo-600 text-white hover:bg-indigo-700'} ${className}`} />;
};
const Input = (props) => <input {...props} className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.className}`} />;

// --- Data ---

const CLINIC_DATA = [
    { name: "Total Health", rating: 5.0, specialty: "Psychologist", address: "B wing, Viral Appts, Swami Vivekananda Rd, opp. Shoppers Stop", phone: "09967843249", quote: "Exceptional care for depression and other mental health issues.", website: "#" },
    { name: "Omni Health Services", rating: 4.8, specialty: "Psychologist", address: "Office No. 303, Unique House, Chakala Rd", phone: "09653677486", quote: "Qualified professionals, great clinic ambiance and excellent care.", website: "#" },
    { name: "Amaha Mental Health Centre", rating: 4.8, specialty: "Psychologist", address: "Unit 601, 6th floor, Notan Heights, 20, Gurunanak Rd", phone: "02071171501", quote: "A safe space with expert therapists.", website: "#" },
    { name: "Dr Jayesh Ghodke - Mind Clinic", rating: 4.9, specialty: "Psychiatrist", address: "EXPRESS ZONE, Mall, off Western Express Highway", phone: "07654782669", quote: "Collaborative approach ensured comprehensive mental health care.", website: "#" },
    { name: "Harmony Mind Clinic", rating: 5.0, specialty: "Psychologist", address: "19th Floor, Panchratna Building, near Opera House", phone: "09326652219", quote: "Best Psychiatrists in Mumbai for various treatments.", website: "#" },
    { name: "Dr. Amitabh Ghosh", rating: 4.9, specialty: "Psychiatrist", address: "VITATSU Healthcare, B-107, Twin Towers, Lokhandwala", phone: "09820199503", quote: "Helped my family to overcome emotional trauma.", website: "#" },
    { name: "Trijog", rating: 4.8, specialty: "Psychologist", address: "B-Wing, 406, Powai Plaza, opp. Nirvana Park", phone: "09619196949", quote: "The counselling sessions really helped me with my mental health struggles.", website: "#" },
    { name: "Astitva Clinic", rating: 4.7, specialty: "Psychologist", address: "Krishna Niwas, 522/B, R P Masani Marg", phone: "09136008076", quote: "They have a good grasp on human psychology and mental health.", website: "#" },
];

const dailyCheckinQuestions = [
    "What is one thing you're looking forward to today?",
    "What's a small act of kindness you could do for yourself today?",
    "If you could describe your current mood as a color, what would it be and why?",
];

const moodColors = {
    happy: 'bg-yellow-400', sad: 'bg-blue-500', anxious: 'bg-purple-500',
    angry: 'bg-red-500', stressed: 'bg-orange-500', grateful: 'bg-green-500',
};

const botResponses = {
    emotions: {
        happy: { acknowledgement: "I'm so glad to hear you're feeling happy! Let's celebrate that joy together.", library: { songs: ["Happy – Pharrell Williams"], books: ["The Happiness Project – Gretchen Rubin"], exercises: ["Dance to your favorite upbeat song."], affirmations: ["I deserve to feel this joy."] }},
        sad: { acknowledgement: "It's okay to feel sad. Acknowledging your feelings is a brave first step. I'm here to sit with you in this feeling.", library: { songs: ["Fix You – Coldplay"], books: ["The Midnight Library – Matt Haig"], exercises: ["Write down 3 things you’re grateful for."], affirmations: ["My feelings are valid and they will pass."] }},
        anxious: { acknowledgement: "I can sense your anxiety. Let’s slow down together and find calm.", library: { songs: ["Weightless – Marconi Union"], books: ["The Untethered Soul – Michael A. Singer"], exercises: ["Try the 4-7-8 breathing technique."], affirmations: ["This feeling is temporary and I am safe."] }},
        stressed: { acknowledgement: "I hear that you're stressed. Let's find a way to lighten that burden together.", library: { songs: ["Breathe Me – Sia"], books: ["Burnout: The Secret to Unlocking the Stress Cycle"], exercises: ["Take 5 deep belly breaths."], affirmations: ["I can handle the challenges that come my way."] }},
        angry: { acknowledgement: "Anger is a powerful emotion. Let’s channel it safely and calmly.", library: { songs: ["Numb – Linkin Park"], books: ["Anger: Wisdom for Cooling the Flames"], exercises: ["Punch a pillow safely."], affirmations: ["I can feel my anger without letting it control me."] }}
    },
    followUp: "Would you like me to suggest another song, book, or exercise?"
};

// --- Child Component for Clinic Cards ---
const ClinicCard = ({ clinic }) => (
    <Card className="p-4 my-2 border-indigo-200 bg-indigo-50 w-full max-w-sm">
        <h4 className="font-bold text-indigo-800">{clinic.name}</h4>
        <p className="text-sm text-indigo-700 font-semibold">{clinic.specialty} ★ {clinic.rating}</p>
        <p className="text-sm text-gray-600 mt-1 italic">"{clinic.quote}"</p>
        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1"><MapPin size={14} className="mt-0.5 shrink-0"/> {clinic.address}</p>
        <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => window.open(clinic.website, '_blank')} className="w-full bg-white"><Globe size={14} className="mr-2"/>Website</Button>
            <Button size="sm" variant="outline" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`, '_blank')} className="w-full bg-white"><MapPin size={14} className="mr-2"/>Directions</Button>
        </div>
    </Card>
);


export const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [activeEmotion, setActiveEmotion] = useState(null);
    const [usedSuggestions, setUsedSuggestions] = useState({});
    const [moodHistory, setMoodHistory] = useState([]);
    const [dailyCheckinQuestion, setDailyCheckinQuestion] = useState("");
    const [currentAffirmation, setCurrentAffirmation] = useState("You are capable of amazing things.");

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        setDailyCheckinQuestion(dailyCheckinQuestions[Math.floor(Math.random() * dailyCheckinQuestions.length)]);
        setMessages([{ 
            id: Date.now(), 
            text: "Hello! Welcome to your wellness space. How are you feeling today?", 
            sender: 'bot',
            suggestions: ["I'm feeling happy", "I'm feeling sad", "I'm feeling anxious", "Find a local clinic"]
        }]);
    }, []);

    useEffect(scrollToBottom, [messages]);

    const getNextSuggestion = (emotion, type) => {
        const library = botResponses.emotions[emotion].library[type];
        return library[Math.floor(Math.random() * library.length)];
    };

    const detectIntent = (text) => {
        const lowerText = text.toLowerCase();
        for (const emotion in botResponses.emotions) {
            if (lowerText.includes(emotion)) return { type: 'emotion', value: emotion };
        }
        if (['clinic', 'therapist', 'help', 'doctor', 'psychiatrist'].some(s => lowerText.includes(s))) {
            return { type: 'clinic', value: null };
        }
        if (['song', 'book', 'exercise', 'affirmation'].some(s => lowerText.includes(s))) {
            const type = lowerText.includes('song') ? 'songs' : lowerText.includes('book') ? 'books' : lowerText.includes('exercise') ? 'exercises' : 'affirmations';
            return { type: 'request', value: type };
        }
        return { type: 'unknown', value: null };
    };
    
    const addBotMessage = (text, { suggestions = [], clinics = [] } = {}) => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot', suggestions, clinics }]);
        setIsTyping(false);
    };

    const handleSendMessage = (textOverride = "") => {
        const text = (textOverride || inputValue).trim();
        if (!text) return;

        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const intent = detectIntent(text);
            if (intent.type === 'emotion') {
                const emotion = intent.value;
                setActiveEmotion(emotion);
                if (!moodHistory.includes(emotion)) {
                    setMoodHistory(prev => [...prev, emotion]);
                }
                setCurrentAffirmation(getNextSuggestion(emotion, 'affirmations'));
                
                const ack = botResponses.emotions[emotion].acknowledgement;
                const suggestions = Object.keys(botResponses.emotions[emotion].library).map(s => `Suggest a ${s.slice(0, -1)}`);
                addBotMessage(`${ack} What kind of support would feel best?`, { suggestions });

            } else if (intent.type === 'request' && activeEmotion) {
                const suggestion = getNextSuggestion(activeEmotion, intent.value);
                const suggestions = Object.keys(botResponses.emotions[activeEmotion].library).map(s => `Suggest a ${s.slice(0, -1)}`);
                addBotMessage(`Of course. Here is a suggestion: "${suggestion}". ${botResponses.followUp}`, { suggestions });
            
            } else if (intent.type === 'clinic') {
                const shuffledClinics = [...CLINIC_DATA].sort(() => 0.5 - Math.random());
                const selectedClinics = shuffledClinics.slice(0, 3);
                addBotMessage("It takes courage to seek professional support. Here are a few highly-rated clinics in Mumbai that might be a good fit for you:", { clinics: selectedClinics });

            } else {
                addBotMessage("I'm here to listen. Tell me a bit more about what's on your mind or ask for help finding a clinic.");
            }
        }, 1200);
    };
    
    return (
        <div className="p-4 rounded-lg bg-gray-50 font-sans">
            <header className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Your Wellness Companion</h1>
                <p className="text-gray-500">A safe space to reflect and grow.</p>
            </header>
            
            <Card className="mb-4 p-4 bg-indigo-50 border-indigo-200 animate-fade-in">
                <div className="flex items-center gap-3">
                    <CheckSquare className="text-indigo-600 h-6 w-6"/>
                    <div>
                        <h3 className="font-semibold text-indigo-800">Daily Check-in</h3>
                        <p className="text-sm text-indigo-700">{dailyCheckinQuestion}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <Card className="h-[600px] flex flex-col">
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, i) => (
                                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                                    <div className={`p-2 rounded-full text-white ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                                        {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                                    </div>
                                    <div className={`flex flex-col gap-1 w-full items-${msg.sender === 'user' ? 'end' : 'start'}`}>
                                        <div className={`p-3 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        {msg.suggestions?.length > 0 && <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">{msg.suggestions.map(s => <Button key={s} size="sm" variant="outline" onClick={() => handleSendMessage(s)}>{s}</Button>)}</div>}
                                        {msg.clinics?.length > 0 && <div className="flex flex-col gap-2 mt-2 w-full">{msg.clinics.map(c => <ClinicCard key={c.name} clinic={c} />)}</div>}
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="text-sm text-gray-500 self-center animate-pulse">Companion is typing...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <Input placeholder="How are you feeling right now?" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                                <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isTyping} variant="hero" size="icon"><Send size={20} /></Button>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="space-y-4">
                     <Card className="p-4 animate-fade-in">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-700"><Quote size={18} /> Affirmation of the Moment</h3>
                        <p className="text-indigo-700 italic text-center p-2 bg-indigo-50 rounded-lg">"{currentAffirmation}"</p>
                    </Card>
                    <Card className="p-4 animate-fade-in">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-700"><BarChart2 size={18} /> Mood Journey</h3>
                        <div className="flex flex-wrap gap-2">
                            {moodHistory.length > 0 ? moodHistory.map((mood, i) => (
                                <div key={i} className={`px-3 py-1 text-sm text-white rounded-full flex items-center gap-1 animate-fade-in ${moodColors[mood]}`}>
                                    {mood}
                                </div>
                            )) : <p className="text-sm text-gray-500">Your session moods will appear here.</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
