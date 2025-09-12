import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart,
  MapPin,
  Phone,
  Mic,
  MicOff
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your emotional wellness companion. How are you feeling today? I'm here to listen and provide support.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    greetings: [
      "Hello! I'm here to support your emotional wellness journey. What's on your mind?",
      "Hi there! How are you feeling today? I'm here to listen.",
      "Welcome! I'm your emotional wellness companion. How can I help you today?"
    ],
    emotions: {
      sad: "I understand you're feeling sad. It's completely normal to have these feelings. Would you like to talk about what's causing these feelings?",
      happy: "I'm so glad to hear you're feeling happy! That's wonderful. What's bringing you joy today?",
      anxious: "Anxiety can be challenging. Let's work through this together. Try taking three deep breaths with me. What's causing you to feel anxious?",
      stressed: "Stress is very common. You're not alone in feeling this way. What specific situations are causing you stress right now?",
      angry: "I hear that you're feeling angry. These feelings are valid. What's triggering these emotions?",
      lonely: "Feeling lonely can be really difficult. I'm here with you right now. Would you like to talk about ways to connect with others?"
    },
    clinic: "I can help you find mental health support in your area. Let me search for nearby clinics and counselors for you.",
    meditation: "Mindfulness can be very helpful. Try this: Close your eyes, take a deep breath in for 4 counts, hold for 4, then exhale for 4. How does that feel?",
    default: "I understand. Tell me more about how you're feeling. I'm here to listen without judgment."
  };

  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) return 'sad';
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('great')) return 'happy';
    if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous')) return 'anxious';
    if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('pressure')) return 'stressed';
    if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('furious')) return 'angry';
    if (lowerText.includes('lonely') || lowerText.includes('alone') || lowerText.includes('isolated')) return 'lonely';
    return 'default';
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    }
    
    if (lowerMessage.includes('clinic') || lowerMessage.includes('therapist') || lowerMessage.includes('counselor') || lowerMessage.includes('help')) {
      return botResponses.clinic;
    }
    
    if (lowerMessage.includes('meditat') || lowerMessage.includes('calm') || lowerMessage.includes('relax')) {
      return botResponses.meditation;
    }
    
    const emotion = detectEmotion(userMessage);
    return botResponses.emotions[emotion as keyof typeof botResponses.emotions] || botResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 gradient-card shadow-emotion text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/10" />
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full gradient-wellness shadow-glow">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            AI Wellness Companion
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your empathetic AI companion for emotional support, guidance, and mental wellness resources.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Empathetic AI
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Clinic Finder
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              24/7 Support
            </Badge>
          </div>
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="gradient-card shadow-emotion">
        <div className="h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'gradient-wellness'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                
                <div className={`max-w-[80%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <Card className={`p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border-muted'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </Card>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full gradient-wellness">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <Card className="p-4 bg-background border-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t bg-background/50">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                className={isListening ? 'bg-red-50 border-red-200' : ''}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              
              <Input
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                variant="hero"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Click mic for voice input
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};