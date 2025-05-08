import { useState, useEffect } from "react";
import { JournalEntry, JournalData } from "@/components/journal/JournalEntry";
import { JournalList } from "@/components/journal/JournalList";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DailyQuote } from "@/components/journal/DailyQuote";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalData[]>([]);
  const [currentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load entries from Supabase on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('id, date, thoughts, feelings, missions')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert string dates back to Date objects
        const formattedEntries = data.map((entry) => ({
          id: entry.id,
          date: new Date(entry.date),
          thoughts: entry.thoughts || '',
          feelings: entry.feelings || '',
          missions: entry.missions || '',
        }));

        setEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        toast({
          title: "Error fetching entries",
          description: "There was a problem loading your journal entries.",
          variant: "destructive"
        });
        
        // Fallback to localStorage if Supabase fails
        const savedEntries = localStorage.getItem("journal-entries");
        if (savedEntries) {
          const parsedEntries: JournalData[] = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setEntries(parsedEntries);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [toast]);

  const handleSaveEntry = async (data: JournalData) => {
    // Only save if there's actual content
    try {
      // Create a unique ID for the entry if one doesn't exist
      const entryId = data.id || uuidv4();
      
      console.log("Saving journal entry:", {
        id: entryId,
        date: data.date.toISOString(),
        thoughts: data.thoughts,
        feelings: data.feelings,
        missions: data.missions
      });
      
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          id: entryId,
          date: data.date.toISOString(),
          thoughts: data.thoughts,
          feelings: data.feelings,
          missions: data.missions
        });

      if (error) throw error;

      // Add the new entry to the state
      const newEntry = { ...data, id: entryId };
      setEntries(prev => [newEntry, ...prev]);

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully."
      });
      
      // Also save to localStorage as backup
      const updatedEntries = [newEntry, ...entries.filter(e => e.id !== entryId)];
      localStorage.setItem("journal-entries", JSON.stringify(updatedEntries));
      
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your journal entry.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleDeleteEntry = async (entryToDelete: JournalData) => {
    try {
      if (!entryToDelete.id) {
        throw new Error("Entry ID is missing");
      }
      
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryToDelete.id);

      if (error) throw error;

      // Remove the deleted entry from state
      setEntries(prev => prev.filter(entry => entry.id !== entryToDelete.id));
      
      // Also remove from localStorage
      localStorage.setItem("journal-entries", JSON.stringify(entries.filter(entry => entry.id !== entryToDelete.id)));
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Error deleting entry",
        description: "There was a problem deleting your journal entry.",
        variant: "destructive"
      });
    }
  };

  const handleSelectEntry = (entry: JournalData) => {
    // Store selected entry in sessionStorage to use in AI Chat
    sessionStorage.setItem("selected-entry", JSON.stringify(entry));
    navigate("/ai-chat");
  };

  return <AppLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway py-0" />
            <h1 className="text-4xl font-heading text-nature-brown py-0 font-semibold md:text-7xl">
              Whispering Grove Journal
            </h1>
            <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway" />
          </div>
          <p className="text-nature-brown/70 font-body text-xl">
            A peaceful place to capture your thoughts, feelings, and weekly missions
          </p>
        </header>
        
        <DailyQuote className="mb-10" />
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-nature-brown">Loading journal entries...</div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr,1fr] items-start">
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-5 text-nature-brown flex items-center gap-2 font-heading">
                <span>New Entry</span>
                <div className="h-1.5 w-1.5 rounded-full bg-nature-brown/40"></div>
                <span className="text-sm font-normal text-nature-brown/60 font-body">
                  {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </span>
              </h2>
              <JournalEntry onSave={handleSaveEntry} currentDate={currentDate} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-5 text-nature-brown font-heading">
                Previous Entries
              </h2>
              <JournalList entries={entries} onSelect={handleSelectEntry} onDelete={handleDeleteEntry} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>;
};
export default JournalPage;
