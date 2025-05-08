
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf } from "lucide-react";
import { Message } from "@/hooks/useChat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
  );
}
