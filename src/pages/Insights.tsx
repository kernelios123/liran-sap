
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { JournalData } from "@/components/journal/JournalEntry";
import { BarChart } from "lucide-react";

const InsightsPage = () => {
  const [entries, setEntries] = useState<JournalData[]>([]);
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journal-entries");
    if (savedEntries) {
      const parsedEntries: JournalData[] = JSON.parse(savedEntries).map(
        (entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })
      );
      setEntries(parsedEntries);
    }
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <BarChart className="h-6 w-6 text-nature-forest" />
            <h1 className="text-3xl font-semibold text-nature-forest">
              Journal Insights
            </h1>
          </div>
          <p className="text-muted-foreground">
            Patterns, statistics and personalized recommendations based on your journal entries
          </p>
        </header>

        <InsightsPanel entries={entries} />
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
