
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JournalData } from "@/components/journal/JournalEntry";
import { format } from "date-fns";

export function useJournalEntry() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchJournalEntry = async (selectedDate: Date) => {
    try {
      setIsLoading(true);

      // Format the date to ISO string for Supabase query
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('date', formattedDate + 'T00:00:00')
        .maybeSingle();
      
      if (error) {
        throw error;
      }

      if (data) {
        const journalData: JournalData = {
          id: data.id,
          date: new Date(data.date),
          thoughts: data.thoughts || '',
          feelings: data.feelings || '',
          missions: data.missions || '',
        };
        
        return {
          entry: journalData,
          message: `I found your journal entry from ${format(new Date(data.date), 'MMMM d, yyyy')}. Would you like to discuss it?`
        };
      } else {
        // No entry found for this date
        return {
          entry: null,
          message: `I couldn't find any journal entries for ${format(selectedDate, 'MMMM d, yyyy')}. Would you like to talk about something else?`
        };
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      return {
        entry: null,
        message: `I'm having trouble retrieving your journal entries. Let's talk about something else for now.`
      };
    } finally {
      setIsLoading(false);
      setDate(undefined); // Close the calendar
    }
  };

  return {
    date,
    setDate,
    isLoading,
    fetchJournalEntry
  };
}
