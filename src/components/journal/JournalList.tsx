
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JournalData } from "./JournalEntry";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

type JournalListProps = {
  entries: JournalData[];
  onSelect: (entry: JournalData) => void;
  onDelete: (entry: JournalData) => void;
};

export function JournalList({ entries, onSelect, onDelete }: JournalListProps) {
  const [entryToDelete, setEntryToDelete] = useState<JournalData | null>(null);

  if (entries.length === 0) {
    return (
      <div className="text-center p-6 bg-nature-cream/80 rounded-xl shadow-soft border border-nature-sage/10">
        <p className="text-nature-brown font-heading">No journal entries yet.</p>
        <p className="text-sm text-nature-brown/60 font-body mt-2">
          Start writing to see your entries here.
        </p>
      </div>
    );
  }

  const handleDeleteClick = (entry: JournalData) => {
    setEntryToDelete(entry);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      onDelete(entryToDelete);
      setEntryToDelete(null);
    }
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
      >
        {entries.map((entry, index) => (
          <AccordionItem
            key={entry.id || index}
            value={`entry-${entry.id || index}`}
            className={cn(
              "border border-nature-sage/20 rounded-xl overflow-hidden",
              "bg-nature-cream/90 shadow-soft"
            )}
          >
            <AccordionTrigger className="px-5 py-3.5 hover:bg-nature-sage/10 transition-colors duration-300">
              <div className="flex justify-between w-full text-left">
                <span className="font-heading text-nature-brown">
                  {entry.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm text-nature-brown/60 font-body">
                  {formatDistanceToNow(entry.date, { addSuffix: true })}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              {entry.thoughts && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-nature-brown font-heading">Thoughts</h4>
                  <p className="text-sm text-nature-brown/80 mt-2 font-body leading-relaxed">{entry.thoughts}</p>
                </div>
              )}
              {entry.feelings && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-nature-brown font-heading">Feelings</h4>
                  <p className="text-sm text-nature-brown/80 mt-2 font-body leading-relaxed">{entry.feelings}</p>
                </div>
              )}
              {entry.missions && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-nature-brown font-heading">Missions</h4>
                  <p className="text-sm text-nature-brown/80 mt-2 font-body leading-relaxed">{entry.missions}</p>
                </div>
              )}
              <div className="mt-5 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-nature-sage text-nature-brown hover:bg-nature-sage/10 transition-all duration-300"
                  onClick={() => onSelect(entry)}
                >
                  Continue in AI Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10 transition-all duration-300"
                  onClick={() => handleDeleteClick(entry)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent className="bg-nature-cream border-nature-sage/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-nature-brown">Are you sure you want to delete this entry?</AlertDialogTitle>
            <AlertDialogDescription className="font-body text-nature-brown/70">
              This action cannot be undone. This entry will be permanently deleted from your journal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body bg-nature-beige text-nature-brown border-nature-sage/20 hover:bg-nature-sage/20">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
