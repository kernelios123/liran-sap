
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JournalData } from "./JournalEntry";
import { cn } from "@/lib/utils";

type JournalListProps = {
  entries: JournalData[];
  onSelect: (entry: JournalData) => void;
};

export function JournalList({ entries, onSelect }: JournalListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center p-6 bg-white/80 rounded-lg shadow-sm border border-nature-sand/20">
        <p className="text-muted-foreground">No journal entries yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start writing to see your entries here.
        </p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
    >
      {entries.map((entry, index) => (
        <AccordionItem
          key={index}
          value={`entry-${index}`}
          className={cn(
            "border border-nature-sand/30 rounded-md overflow-hidden",
            "bg-white/80 shadow-sm"
          )}
        >
          <AccordionTrigger className="px-4 py-3 hover:bg-secondary/30 transition-colors">
            <div className="flex justify-between w-full text-left">
              <span className="font-medium">
                {entry.date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(entry.date, { addSuffix: true })}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {entry.thoughts && (
              <div className="mb-2">
                <h4 className="text-sm font-medium text-nature-forest">Thoughts</h4>
                <p className="text-sm text-foreground mt-1">{entry.thoughts}</p>
              </div>
            )}
            {entry.feelings && (
              <div className="mb-2">
                <h4 className="text-sm font-medium text-nature-forest">Feelings</h4>
                <p className="text-sm text-foreground mt-1">{entry.feelings}</p>
              </div>
            )}
            {entry.missions && (
              <div className="mb-2">
                <h4 className="text-sm font-medium text-nature-forest">Missions</h4>
                <p className="text-sm text-foreground mt-1">{entry.missions}</p>
              </div>
            )}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest/10"
                onClick={() => onSelect(entry)}
              >
                Continue in AI Chat
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
