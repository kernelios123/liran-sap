
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Send, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalData } from "../journal/JournalEntry";
import { GeminiMessage, generateGeminiResponse } from "@/utils/geminiApi";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [fetchedEntry, setFetchedEntry] = useState<JournalData | null>(null);
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

      setFetchedEntry(selectedEntry);
    }
  }, [selectedEntry]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchJournalEntry = async (selectedDate: Date) => {
    try {
      setIsTyping(true);

      // Format the date to ISO string for Supabase query
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('date', formattedDate + 'T00:00:00')
        .maybeSingle();
      
      if (error) {
        throw error;
      }

      if (data) {
        const journalData: JournalData = {
          id: data.id,
          date: new Date(data.date),
          thoughts: data.thoughts || '',
          feelings: data.feelings || '',
          missions: data.missions || '',
        };
        
        setFetchedEntry(journalData);
        
        // Notify the AI about the fetched entry
        const aiMessage: Message = {
          id: `ai-fetch-${Date.now()}`,
          sender: "ai",
          text: `I found your journal entry from ${format(new Date(data.date), 'MMMM d, yyyy')}. Would you like to discuss it?`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // No entry found for this date
        const aiMessage: Message = {
          id: `ai-fetch-error-${Date.now()}`,
          sender: "ai",
          text: `I couldn't find any journal entries for ${format(selectedDate, 'MMMM d, yyyy')}. Would you like to talk about something else?`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setFetchedEntry(null);
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      
      const aiMessage: Message = {
        id: `ai-fetch-error-${Date.now()}`,
        sender: "ai",
        text: `I'm having trouble retrieving your journal entries. Let's talk about something else for now.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
      setDate(undefined); // Close the calendar
    }
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
    
    // Add entry context if available (either from selectedEntry prop or fetched entry)
    const entryToUse = fetchedEntry || selectedEntry;
    if (entryToUse) {
      let entryContext = `The user has a journal entry from ${entryToUse.date.toLocaleDateString()}.\n`;
      
      if (entryToUse.thoughts) {
        entryContext += `Thoughts: ${entryToUse.thoughts}\n`;
      }
      
      if (entryToUse.feelings) {
        entryContext += `Feelings: ${entryToUse.feelings}\n`;
      }
      
      if (entryToUse.missions && typeof entryToUse.missions === 'string') {
        entryContext += `Missions: ${entryToUse.missions}`;
      } else if (entryToUse.missions && Array.isArray(entryToUse.missions)) {
        entryContext += `Missions: ${entryToUse.missions.join(", ")}`;
      }
      
      geminiMessages.push({
        role: "user",
        parts: ["Here is information about the user's journal entry:\n" + entryContext]
      });
      
      geminiMessages.push({
        role: "model",
        parts: ["Thank you for sharing this context about the user's journal entry. I'll use this information to provide personalized guidance and insights."]
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Calendar className="h-4 w-4" />
                <span className="sr-only">Select journal date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    fetchJournalEntry(newDate);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
