
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
}
