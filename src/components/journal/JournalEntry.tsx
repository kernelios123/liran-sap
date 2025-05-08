
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Pencil, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type JournalEntryProps = {
  onSave: (data: JournalData) => void;
  currentDate: Date;
};

export type JournalData = {
  date: Date;
  thoughts: string;
  feelings: string;
  missions: string;
};

export function JournalEntry({ onSave, currentDate }: JournalEntryProps) {
  const [thoughts, setThoughts] = useState("");
  const [feelings, setFeelings] = useState("");
  const [missions, setMissions] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    // Don't require content if only missions were entered
    if (!thoughts && !feelings && !missions) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving",
        variant: "destructive",
      });
      return;
    }

    // Only save journal entry if there are thoughts or feelings
    if (thoughts || feelings) {
      // Save the entry without missions (they go to tasks)
      const journalData = {
        date: currentDate,
        thoughts,
        feelings,
        missions: "", // Don't save missions in journal entries
      };
      
      onSave(journalData);
      
      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved",
        action: (
          <div className="h-8 w-8 bg-[#D4B996]/20 rounded-full flex items-center justify-center">
            <Leaf className="h-4 w-4 text-[#B56B45]" />
          </div>
        ),
      });
      
      // Clear thoughts and feelings after saving
      setThoughts("");
      setFeelings("");
    }

    // Process missions separately if provided
    if (missions && missions.trim() !== "") {
      processMissionsAsTasks(missions, currentDate);
      setMissions(""); // Clear missions after processing
    }
  };
  
  const processMissionsAsTasks = (missionText: string, date: Date) => {
    // Check if there are missions to process
    if (!missionText || missionText.trim() === "") return;
    
    // Get existing tasks
    const savedTasks = localStorage.getItem("journal-tasks");
    let existingTasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Process missions into tasks
    const missionLines = missionText
      .split("\n")
      .filter(line => line.trim() !== "");
    
    const newTasks = missionLines.map(line => ({
      id: `${date.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      text: line.trim(),
      completed: false,
      date: date,
    }));
    
    // Add only new tasks (avoid duplicates)
    const allTasks = [...existingTasks];
    
    newTasks.forEach(newTask => {
      const isDuplicate = existingTasks.some((existingTask: any) => 
        existingTask.text === newTask.text
      );
      
      if (!isDuplicate) {
        allTasks.push(newTask);
      }
    });
    
    // Save back to localStorage
    localStorage.setItem("journal-tasks", JSON.stringify(allTasks));
    
    // Show notification and navigate to tasks page
    if (newTasks.length > 0) {
      toast({
        title: "Tasks Created",
        description: `${newTasks.length} mission${newTasks.length > 1 ? 's' : ''} added to your tasks list`,
      });
      navigate("/tasks");
    }
  };

  const handleMissionsSubmit = () => {
    if (!missions || missions.trim() === "") {
      toast({
        title: "No Missions",
        description: "Please write at least one mission before adding",
        variant: "destructive",
      });
      return;
    }

    processMissionsAsTasks(missions, currentDate);
    setMissions("");
  };

  return (
    <Card className="w-full shadow-lg border-[#D4B996]/40 animate-fade-in overflow-hidden backdrop-blur-sm transition-all hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[#D4B996]/30 to-[#B6C199]/20 rounded-t-md py-6">
        <CardTitle className="flex items-center gap-3">
          <Pencil className="h-6 w-6 text-[#B56B45]" />
          <span className="text-2xl text-[#7D5A50]">New Journal Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-6">
        <Tabs defaultValue="thoughts" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-[#E6DFD9] p-1.5 rounded-md">
            <TabsTrigger 
              value="thoughts"
              className="data-[state=active]:bg-white data-[state=active]:text-[#7D5A50] data-[state=active]:shadow-md py-2.5"
            >
              Thoughts
            </TabsTrigger>
            <TabsTrigger 
              value="feelings"
              className="data-[state=active]:bg-white data-[state=active]:text-[#7D5A50] data-[state=active]:shadow-md py-2.5"
            >
              Feelings
            </TabsTrigger>
            <TabsTrigger 
              value="missions"
              className="data-[state=active]:bg-white data-[state=active]:text-[#7D5A50] data-[state=active]:shadow-md py-2.5"
            >
              Weekly Missions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="thoughts" className="mt-0">
            <Textarea
              placeholder="Write your thoughts for today..."
              className={cn(
                "min-h-[320px] resize-none focus-visible:ring-[#C87C56] text-lg p-4",
                "bg-white/70 border-[#D4B996]/30 shadow-inner rounded-md"
              )}
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="feelings" className="mt-0">
            <Textarea
              placeholder="How are you feeling today?"
              className={cn(
                "min-h-[320px] resize-none focus-visible:ring-[#C87C56] text-lg p-4",
                "bg-white/70 border-[#D4B996]/30 shadow-inner rounded-md"
              )}
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="missions" className="mt-0">
            <Textarea
              placeholder="What are your missions for this week? Add one mission per line to create tasks automatically."
              className={cn(
                "min-h-[280px] resize-none focus-visible:ring-[#C87C56] text-lg p-4",
                "bg-white/70 border-[#D4B996]/30 shadow-inner rounded-md"
              )}
              value={missions}
              onChange={(e) => setMissions(e.target.value)}
            />
            <Button 
              onClick={handleMissionsSubmit} 
              className="mt-4 bg-[#B56B45] hover:bg-[#C87C56] shadow-md transition-all hover:translate-y-[-2px] text-white font-medium px-6 py-5 text-base flex items-center gap-2"
            >
              <ListTodo className="h-5 w-5" />
              Add to Tasks
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end bg-gradient-to-r from-[#E6DFD9]/50 to-[#D4B996]/30 py-6 px-8 rounded-b-md">
        <Button 
          onClick={handleSave} 
          className="bg-[#B56B45] hover:bg-[#C87C56] shadow-md transition-all hover:translate-y-[-2px] text-white font-medium px-6 py-5 text-base"
        >
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
