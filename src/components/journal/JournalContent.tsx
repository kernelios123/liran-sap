
import { useState } from "react";
import { JournalEntry, JournalData } from "@/components/journal/JournalEntry";
import { JournalList } from "@/components/journal/JournalList";
import { DailyQuote } from "@/components/journal/DailyQuote";
import { useNavigate } from "react-router-dom";

interface JournalContentProps {
  entries: JournalData[];
  isLoading: boolean;
  onSaveEntry: (data: JournalData) => Promise<boolean>;
  onDeleteEntry: (entry: JournalData) => void;
}

export function JournalContent({ entries, isLoading, onSaveEntry, onDeleteEntry }: JournalContentProps) {
  const [currentDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const handleSelectEntry = (entry: JournalData) => {
    // Store selected entry in sessionStorage to use in AI Chat
    sessionStorage.setItem("selected-entry", JSON.stringify(entry));
    navigate("/ai-chat");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse text-nature-brown">Loading journal entries...</div>
      </div>
    );
  }

  return (
    <>
      <DailyQuote className="mb-10" />
        
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
          <JournalEntry onSave={onSaveEntry} currentDate={currentDate} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-5 text-nature-brown font-heading">
            Previous Entries
          </h2>
          <JournalList entries={entries} onSelect={handleSelectEntry} onDelete={onDeleteEntry} />
        </div>
      </div>
    </>
  );
}
