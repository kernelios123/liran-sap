import { useState, useEffect } from "react";
import { JournalEntry, JournalData } from "@/components/journal/JournalEntry";
import { JournalList } from "@/components/journal/JournalList";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DailyQuote } from "@/components/journal/DailyQuote";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalData[]>([]);
  const [currentDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journal-entries");
    if (savedEntries) {
      // Convert string dates back to Date objects
      const parsedEntries: JournalData[] = JSON.parse(savedEntries).map(
        (entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })
      );
      setEntries(parsedEntries);
    }
  }, []);

  // Save entries to localStorage whenever entries state changes
  useEffect(() => {
    localStorage.setItem("journal-entries", JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (data: JournalData) => {
    // Only save if there's actual content (thoughts or feelings)
    if (data.thoughts || data.feelings) {
      setEntries((prev) => [data, ...prev]);
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });
    }
  };

  const handleDeleteEntry = (entryToDelete: JournalData) => {
    setEntries((prev) => 
      prev.filter((entry) => 
        // Compare by date timestamp since dates are objects
        entry.date.getTime() !== entryToDelete.date.getTime() ||
        entry.thoughts !== entryToDelete.thoughts ||
        entry.feelings !== entryToDelete.feelings ||
        entry.missions !== entryToDelete.missions
      )
    );
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
      variant: "destructive",
    });
  };

  const handleSelectEntry = (entry: JournalData) => {
    // Store selected entry in sessionStorage to use in AI Chat
    sessionStorage.setItem("selected-entry", JSON.stringify(entry));
    navigate("/ai-chat");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-grove-text mb-2">
            Whispering Grove Journal
          </h1>
          <p className="text-lg text-grove-muted">
            A peaceful place for your thoughts and tasks
          </p>
        </header>
        
        <DailyQuote />
        
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr] items-start">
          <div className="w-full">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-grove-text flex items-center gap-2">
              <span>New Entry</span>
              <span className="text-sm font-normal text-grove-muted ml-2">
                — {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </h2>
            <JournalEntry onSave={handleSaveEntry} currentDate={currentDate} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-4 text-grove-text">
              Previous Entries
            </h2>
            <JournalList 
              entries={entries} 
              onSelect={handleSelectEntry} 
              onDelete={handleDeleteEntry}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default JournalPage;
