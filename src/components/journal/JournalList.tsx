
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
      <div className="text-center p-6 bg-white/80 rounded-lg shadow-sm border border-nature-sand/20">
        <p className="text-muted-foreground">No journal entries yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
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
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-nature-forest text-nature-forest hover:bg-nature-forest/10"
                  onClick={() => onSelect(entry)}
                >
                  Continue in AI Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This entry will be permanently deleted from your journal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
