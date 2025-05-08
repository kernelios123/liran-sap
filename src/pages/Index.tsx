
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
    setEntries((prev) => [data, ...prev]);
    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved successfully.",
    });
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
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <Leaf className="h-8 w-8 text-[#B56B45] animate-leaf-sway" />
            <h1 className="text-4xl md:text-5xl font-semibold text-[#7D5A50]">
              Whispering Grove Journal
            </h1>
            <Leaf className="h-8 w-8 text-[#B56B45] animate-leaf-sway" />
          </div>
          <p className="text-lg text-[#886F68]">
            A peaceful place to capture your thoughts, feelings, and weekly missions
          </p>
        </header>
        
        <DailyQuote className="mb-8" />
        
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr] items-start">
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4 text-[#7D5A50] flex items-center gap-2">
              <span>New Entry</span>
              <div className="h-1 w-1 rounded-full bg-[#B56B45]"></div>
              <span className="text-sm font-normal text-[#886F68]">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </h2>
            <JournalEntry onSave={handleSaveEntry} currentDate={currentDate} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#7D5A50]">
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
