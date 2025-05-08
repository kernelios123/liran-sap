
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="bg-grove-card/90 border-grove-accent/20 shadow-sm rounded-xl">
        <CardContent className="p-6 text-center">
          <p className="text-grove-muted">No journal entries yet.</p>
        </CardContent>
      </Card>
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
      <div className="space-y-3">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <Card 
              key={index}
              className="bg-grove-card/90 border-grove-accent/20 shadow-sm rounded-xl overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-grove-text">
                    {entry.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-grove-muted">
                    {formatDistanceToNow(entry.date, { addSuffix: true })}
                  </span>
                </div>
                {entry.thoughts && (
                  <p className="text-sm text-grove-text line-clamp-2 mb-3">{entry.thoughts}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="border-grove-accent/30 text-grove-text hover:bg-grove-accent/10 px-2 h-8"
                    onClick={() => onSelect(entry)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-xs">AI chat</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-grove-accent/30 text-grove-text hover:bg-grove-accent/10 px-2 h-8"
                    onClick={() => handleDeleteClick(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-6 bg-grove-card rounded-xl">
            <p className="text-grove-muted">No journal entries yet.</p>
          </div>
        )}
      </div>

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
