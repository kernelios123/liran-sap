
import { useState, useEffect } from "react";
import { JournalData } from "@/components/journal/JournalEntry";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const saveEntry = async (data: JournalData) => {
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

  const deleteEntry = async (entryToDelete: JournalData) => {
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

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry
  };
}
