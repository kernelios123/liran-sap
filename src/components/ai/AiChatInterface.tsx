
import { useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { JournalData } from "../journal/JournalEntry";
import { useChat } from "@/hooks/useChat";
import { useJournalEntry } from "@/hooks/useJournalEntry";

type AiChatInterfaceProps = {
  selectedEntry?: JournalData;
};

export function AiChatInterface({ selectedEntry }: AiChatInterfaceProps) {
  const { 
    messages, 
    isTyping, 
    fetchedEntry, 
    setFetchedEntry, 
    sendMessage 
  } = useChat(selectedEntry);

  const { 
    date, 
    setDate, 
    isLoading,
    fetchJournalEntry
  } = useJournalEntry();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Watch for date changes and fetch journal entries
  useEffect(() => {
    const fetchEntry = async () => {
      if (date) {
        const result = await fetchJournalEntry(date);
        
        // Update the fetched entry
        setFetchedEntry(result.entry);
        
        // Add AI message about the fetched entry
        if (result.message) {
          const aiMessage = {
            id: `ai-fetch-${Date.now()}`,
            sender: "ai" as const,
            text: result.message,
            timestamp: new Date(),
          };
          
          // This will trigger the scrollToBottom effect
          sendMessage(aiMessage.text);
        }
      }
    };
    
    if (date) {
      fetchEntry();
    }
  }, [date]);

  return (
    <Card className="w-full h-[70vh] flex flex-col shadow-md border-nature-sand/30">
      <ChatHeader date={date} setDate={setDate} />
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <MessageInput onSendMessage={sendMessage} />
      </CardFooter>
    </Card>
  );
}
