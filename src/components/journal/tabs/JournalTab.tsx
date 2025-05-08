
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type JournalTabProps = {
  journalContent: string;
  setJournalContent: (content: string) => void;
};

export function JournalTab({ journalContent, setJournalContent }: JournalTabProps) {
  return (
    <Textarea
      placeholder="Write your thoughts and feelings for today..."
      className={cn(
        "min-h-[320px] resize-none focus-visible:ring-[#C87C56] text-lg p-4",
        "bg-white/70 border-[#D4B996]/30 shadow-inner rounded-md"
      )}
      value={journalContent}
      onChange={(e) => setJournalContent(e.target.value)}
    />
  );
}
