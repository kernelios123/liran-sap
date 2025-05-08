
import { useState, useEffect } from "react";
import { JournalData } from "@/components/journal/JournalEntry";
import { GeminiMessage, generateGeminiResponse } from "@/utils/geminiApi";

export type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
};

export function useChat(selectedEntry?: JournalData) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I'm your Grove Guide. I'm here to help you reflect on your journal entries and provide insights. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [fetchedEntry, setFetchedEntry] = useState<JournalData | null>(null);
  const apiKey = "AIzaSyByz3LGrosVYpnuVPzw_gUvJfwsCruuxJ8";

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

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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

  return {
    messages,
    isTyping,
    fetchedEntry,
    setFetchedEntry,
    sendMessage
  };
}
