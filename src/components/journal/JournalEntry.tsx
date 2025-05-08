import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { JournalTab } from "./tabs/JournalTab";
import { MissionsTab } from "./tabs/MissionsTab";
import { processMissionsAsTasks } from "./TaskProcessor";

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
  const [journalContent, setJournalContent] = useState("");
  const [missions, setMissions] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    // Don't require content if only missions were entered
    if (!journalContent && !missions) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving",
        variant: "destructive",
      });
      return;
    }

    // Only save journal entry if there is content
    if (journalContent) {
      // Save the entry without missions (they go to tasks)
      const journalData = {
        date: currentDate,
        thoughts: journalContent, // Save all content as thoughts
        feelings: "", // No longer using separate feelings field
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
      
      // Clear journal content after saving
      setJournalContent("");
    }

    // Process missions separately if provided
    if (missions && missions.trim() !== "") {
      processMissionsAsTasks(missions, currentDate, navigate);
      setMissions(""); // Clear missions after processing
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

    processMissionsAsTasks(missions, currentDate, navigate);
    setMissions("");
  };

  return (
    <Card className="w-full shadow-sm border border-grove-accent/20 bg-grove-card/90 rounded-xl overflow-hidden">
      <CardContent className="p-6 pt-6">
        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-grove-background rounded-md">
            <TabsTrigger 
              value="journal"
              className="data-[state=active]:bg-white/70 data-[state=active]:text-grove-text py-3 font-medium"
            >
              Journal
            </TabsTrigger>
            <TabsTrigger 
              value="missions"
              className="data-[state=active]:bg-white/70 data-[state=active]:text-grove-text py-3 font-medium"
            >
              AI chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="journal" className="mt-0">
            <textarea
              placeholder="Write your thoughts and feelings for today..."
              className="min-h-[240px] w-full resize-none bg-white/70 border-grove-accent/20 rounded-md p-4 text-grove-text focus:outline-none focus:ring-1 focus:ring-grove-accent/50"
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="missions" className="mt-0">
            <div className="min-h-[240px] bg-white/70 border border-grove-accent/20 rounded-md p-4">
              AI chat feature will be here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end bg-grove-background/30 py-4 px-6 rounded-b-xl">
        <Button 
          onClick={handleSave} 
          className="bg-grove-accent hover:bg-grove-accent/90 text-white font-medium px-6"
        >
          New Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
