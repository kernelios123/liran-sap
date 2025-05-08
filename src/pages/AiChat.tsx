
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AiChatInterface } from "@/components/ai/AiChatInterface";
import { JournalData } from "@/components/journal/JournalEntry";
import { Leaf, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const AiChatPage = () => {
  const [selectedEntry, setSelectedEntry] = useState<JournalData | undefined>();
  
  useEffect(() => {
    // Check if there's a selected entry in sessionStorage
    const storedEntry = sessionStorage.getItem("selected-entry");
    if (storedEntry) {
      const parsedEntry = JSON.parse(storedEntry);
      setSelectedEntry({
        ...parsedEntry,
        date: new Date(parsedEntry.date),
      });
      // Clear the session storage so it doesn't keep showing on refresh
      sessionStorage.removeItem("selected-entry");
    }
  }, []);

  // Helper function to safely render missions content
  const renderMissions = (missions: string | string[] | undefined) => {
    if (!missions) return "";
    
    if (typeof missions === 'string') {
      return missions.substring(0, 100) + (missions.length > 100 ? "..." : "");
    }
    
    if (Array.isArray(missions)) {
      const missionsText = missions.join(", ");
      return missionsText.substring(0, 100) + (missionsText.length > 100 ? "..." : "");
    }
    
    return "";
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <MessageSquare className="h-6 w-6 text-nature-forest" />
            <h1 className="text-3xl font-semibold text-nature-forest">
              AI Grove Guide
            </h1>
            <Leaf className="h-6 w-6 text-nature-leaf animate-leaf-sway" />
          </div>
          <p className="text-muted-foreground">
            Chat with your AI guide who remembers your journal entries and helps you reflect
          </p>
        </header>

        <div className="grid gap-8">
          {selectedEntry && (
            <Card className="bg-white/80 border-nature-sand/30 shadow-sm animate-fade-in">
              <CardContent className="p-4">
                <h3 className="font-medium text-nature-forest mb-2">
                  Discussing entry from {format(selectedEntry.date, 'MMMM d, yyyy')}
                </h3>
                {selectedEntry.thoughts && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Thoughts:</span> {selectedEntry.thoughts.substring(0, 100)}
                    {selectedEntry.thoughts.length > 100 ? "..." : ""}
                  </p>
                )}
                {selectedEntry.feelings && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Feelings:</span> {selectedEntry.feelings.substring(0, 100)}
                    {selectedEntry.feelings.length > 100 ? "..." : ""}
                  </p>
                )}
                {selectedEntry.missions && (
                  <p className="text-sm">
                    <span className="font-medium">Missions:</span> {renderMissions(selectedEntry.missions)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          <AiChatInterface selectedEntry={selectedEntry} />
        </div>
      </div>
    </AppLayout>
  );
};

export default AiChatPage;
