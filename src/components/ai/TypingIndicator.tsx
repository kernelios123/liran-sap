
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Leaf } from "lucide-react";

export function TypingIndicator() {
  return (
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
  );
}
