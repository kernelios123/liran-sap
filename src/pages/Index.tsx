
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
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway" />
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-nature-brown">
              Whispering Grove Journal
            </h1>
            <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway" />
          </div>
          <p className="text-lg text-nature-brown/70 font-body">
            A peaceful place to capture your thoughts, feelings, and weekly missions
          </p>
        </header>
        
        <DailyQuote className="mb-10" />
        
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr] items-start">
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-5 text-nature-brown flex items-center gap-2 font-heading">
              <span>New Entry</span>
              <div className="h-1.5 w-1.5 rounded-full bg-nature-brown/40"></div>
              <span className="text-sm font-normal text-nature-brown/60 font-body">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </h2>
            <JournalEntry onSave={handleSaveEntry} currentDate={currentDate} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-nature-brown font-heading">
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
