
import { useState, useEffect } from "react";
import { JournalEntry, JournalData } from "@/components/journal/JournalEntry";
import { JournalList } from "@/components/journal/JournalList";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Leaf } from "lucide-react";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalData[]>([]);
  const [currentDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  
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
  };

  const handleSelectEntry = (entry: JournalData) => {
    // Store selected entry in sessionStorage to use in AI Chat
    sessionStorage.setItem("selected-entry", JSON.stringify(entry));
    navigate("/ai-chat");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Leaf className="h-6 w-6 text-nature-leaf animate-leaf-sway" />
            <h1 className="text-3xl font-semibold text-nature-forest">
              Whispering Grove Journal
            </h1>
            <Leaf className="h-6 w-6 text-nature-leaf animate-leaf-sway" />
          </div>
          <p className="text-muted-foreground">
            A peaceful place to capture your thoughts, feelings, and weekly missions
          </p>
        </header>
        
        <div className="grid gap-8 md:grid-cols-[1fr,1fr]">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-nature-forest">New Entry</h2>
            <JournalEntry onSave={handleSaveEntry} currentDate={currentDate} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-nature-forest">
              Previous Entries
            </h2>
            <JournalList entries={entries} onSelect={handleSelectEntry} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default JournalPage;
