
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalData } from "@/components/journal/JournalEntry";
import { Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<JournalData[]>([]);
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  
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
      
      // Create a set of date strings for days with entries
      const dates = new Set<string>();
      parsedEntries.forEach((entry) => {
        dates.add(format(new Date(entry.date), "yyyy-MM-dd"));
      });
      setEntryDates(dates);
    }
  }, []);
  
  // Find entry for selected date
  const selectedDateEntry = entries.find(
    (entry) => format(new Date(entry.date), "yyyy-MM-dd") === (date ? format(date, "yyyy-MM-dd") : "")
  );
  
  const handleViewInChat = () => {
    if (selectedDateEntry) {
      sessionStorage.setItem("selected-entry", JSON.stringify(selectedDateEntry));
      navigate("/ai-chat");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <CalendarIcon className="h-6 w-6 text-nature-forest" />
            <h1 className="text-3xl font-semibold text-nature-forest">
              Journal Calendar
            </h1>
          </div>
          <p className="text-muted-foreground">
            View your journal entries by date
          </p>
        </header>
        
        <div className="grid gap-8 md:grid-cols-[1fr,1fr]">
          <Card className="shadow-md border-nature-sand/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-nature-forest">Your Journal Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-3"
                modifiers={{
                  hasEntry: (day) => entryDates.has(format(day, "yyyy-MM-dd")),
                }}
                modifiersClassNames={{
                  hasEntry: "bg-nature-leaf/20 font-medium text-nature-forest",
                }}
              />
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-nature-leaf/20"></div>
                  <span>Journal Entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted"></div>
                  <span>No Entry</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "shadow-md border-nature-sand/30",
            selectedDateEntry ? "bg-white/90" : "bg-white/50"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-nature-forest">
                {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEntry ? (
                <div className="space-y-4">
                  {selectedDateEntry.thoughts && (
                    <div>
                      <h3 className="font-medium mb-1">Thoughts</h3>
                      <p className="text-sm">{selectedDateEntry.thoughts}</p>
                    </div>
                  )}
                  {selectedDateEntry.feelings && (
                    <div>
                      <h3 className="font-medium mb-1">Feelings</h3>
                      <p className="text-sm">{selectedDateEntry.feelings}</p>
                    </div>
                  )}
                  {selectedDateEntry.missions && (
                    <div>
                      <h3 className="font-medium mb-1">Weekly Missions</h3>
                      <p className="text-sm">{selectedDateEntry.missions}</p>
                    </div>
                  )}
                  <button
                    onClick={handleViewInChat}
                    className="text-sm mt-4 text-nature-forest underline underline-offset-4 hover:text-nature-forest/80"
                  >
                    Discuss this entry with AI Grove Guide
                  </button>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  {date ? "No journal entry for this date" : "Select a date to view entries"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
