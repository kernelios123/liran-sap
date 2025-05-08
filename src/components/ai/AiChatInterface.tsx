
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalData } from "../journal/JournalEntry";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
};

type AiChatInterfaceProps = {
  selectedEntry?: JournalData;
};

export function AiChatInterface({ selectedEntry }: AiChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm your Grove Guide. I'm here to help you reflect on your journal entries and provide insights. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simple responses for demonstration
  const aiResponses = [
    "That's interesting. Can you tell me more about that?",
    "I notice you've mentioned feeling this way before. How is it different now?",
    "Based on your journal entries, it seems like you're making progress on your goals.",
    "Have you considered how your daily activities affect your mood?",
    "Nature can be very healing. Have you spent time outdoors lately?",
    "What small step could you take today toward one of your missions?",
    "I remember you mentioned feeling similar things last week. Has anything changed?",
  ];

  useEffect(() => {
    if (selectedEntry) {
      const entryText = `I see you wrote about ${
        selectedEntry.thoughts ? "your thoughts" : ""
      }${selectedEntry.feelings ? (selectedEntry.thoughts ? " and " : "") + "your feelings" : ""}${
        selectedEntry.missions ? (selectedEntry.thoughts || selectedEntry.feelings ? " and " : "") + "your missions" : ""
      } on ${selectedEntry.date.toLocaleDateString()}. Would you like to discuss any of these topics?`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: `entry-${Date.now()}`,
          sender: "ai",
          text: entryText,
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedEntry]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[70vh] flex flex-col shadow-md border-nature-sand/30">
      <CardHeader className="bg-gradient-to-r from-nature-leaf/10 to-nature-sky/5 rounded-t-md">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-nature-leaf" />
          <span>Grove Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.sender === "user" ? "ml-auto" : ""
              )}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/leaf-pattern.svg" />
                  <AvatarFallback className="bg-nature-leaf/20 text-nature-forest">
                    <Leaf className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-nature-leaf/20 text-nature-forest">
                  <Leaf className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-nature-forest animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-nature-forest animate-pulse delay-150"></span>
                  <span className="w-2 h-2 rounded-full bg-nature-forest animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[50px] resize-none focus-visible:ring-nature-leaf"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-nature-forest hover:bg-nature-forest/90 h-[50px] w-[50px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
