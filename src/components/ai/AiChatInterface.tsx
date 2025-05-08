
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalData } from "../journal/JournalEntry";
import { GeminiMessage, generateGeminiResponse } from "@/utils/geminiApi";

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
  const apiKey = "AIzaSyByz3LGrosVYpnuVPzw_gUvJfwsCruuxJ8";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedEntry) {
      // Fix the type error - ensure missions is treated as an array if it exists
      const missionsText = selectedEntry.missions && Array.isArray(selectedEntry.missions) 
        ? selectedEntry.missions.join(", ")
        : selectedEntry.missions;
        
      const entryText = `I see you wrote about ${
        selectedEntry.thoughts ? "your thoughts" : ""
      }${selectedEntry.feelings ? (selectedEntry.thoughts ? " and " : "") + "your feelings" : ""}${
        missionsText ? (selectedEntry.thoughts || selectedEntry.feelings ? " and " : "") + "your missions" : ""
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Convert the conversation history to Gemini format
    const geminiMessages: GeminiMessage[] = [];
    
    // Add system context
    geminiMessages.push({
      role: "user",
      parts: ["You are the Grove Guide, an AI assistant in a journaling app called 'Whispering Grove Journal'. Your role is to help users reflect on their thoughts, feelings, and missions in a calm, nature-inspired way. Be empathetic, thoughtful, and provide gentle guidance. Keep your responses concise but meaningful."]
    });
    
    geminiMessages.push({
      role: "model",
      parts: ["I understand my role as the Grove Guide. I'll help users reflect on their journal entries with empathy and thoughtfulness, while keeping a calm, nature-inspired tone. I'm ready to assist."]
    });
    
    // Add entry context if available
    if (selectedEntry) {
      let entryContext = `The user has a journal entry from ${selectedEntry.date.toLocaleDateString()}.\n`;
      
      if (selectedEntry.thoughts) {
        entryContext += `Thoughts: ${selectedEntry.thoughts}\n`;
      }
      
      if (selectedEntry.feelings) {
        entryContext += `Feelings: ${selectedEntry.feelings}\n`;
      }
      
      if (selectedEntry.missions && Array.isArray(selectedEntry.missions)) {
        entryContext += `Missions: ${selectedEntry.missions.join(", ")}`;
      } else if (selectedEntry.missions) {
        entryContext += `Missions: ${selectedEntry.missions}`;
      }
      
      geminiMessages.push({
        role: "user",
        parts: ["Here is information about the user's journal entry:\n" + entryContext]
      });
      
      geminiMessages.push({
        role: "model",
        parts: ["Thank you for sharing this context about the user's journal entry. I'll use this information to provide more personalized guidance."]
      });
    }
    
    // Add conversation history (limit to last 10 messages for token limits)
    const conversationHistory = messages.slice(-10);
    conversationHistory.forEach(msg => {
      geminiMessages.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [msg.text]
      });
    });
    
    // Add the current user message
    geminiMessages.push({
      role: "user",
      parts: [input]
    });

    try {
      const response = await generateGeminiResponse(geminiMessages, apiKey);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        text: "I'm having trouble connecting to my knowledge base. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Card className="w-full h-[70vh] flex flex-col shadow-md border-nature-sand/30">
        <CardHeader className="bg-gradient-to-r from-nature-leaf/10 to-nature-sky/5 rounded-t-md flex flex-row items-center justify-between">
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
    </>
  );
}
