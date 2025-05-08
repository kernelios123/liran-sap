
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalContent } from "@/components/journal/JournalContent";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { AppLayout } from "@/components/layout/AppLayout";

const JournalPage = () => {
  const { entries, isLoading, saveEntry, deleteEntry } = useJournalEntries();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <JournalHeader />
        <JournalContent
          entries={entries}
          isLoading={isLoading}
          onSaveEntry={saveEntry}
          onDeleteEntry={deleteEntry}
        />
      </div>
    </AppLayout>
  );
};

export default JournalPage;
