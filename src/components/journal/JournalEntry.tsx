
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { JournalTab } from "./tabs/JournalTab";
import { MissionsTab } from "./tabs/MissionsTab";
import { processMissionsAsTasks } from "./TaskProcessor";
import { supabase } from "@/integrations/supabase/client";

type JournalEntryProps = {
  onSave: (data: JournalData) => void;
  currentDate: Date;
};

export type JournalData = {
  id?: string;
  date: Date;
  thoughts: string;
  feelings: string;
  missions: string;
};

export function JournalEntry({
  onSave,
  currentDate
}: JournalEntryProps) {
  const [journalContent, setJournalContent] = useState("");
  const [missions, setMissions] = useState("");
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    // Don't require content if only missions were entered
    if (!journalContent && !missions) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      // Only save journal entry if there is content
      if (journalContent) {
        // Save all journal content as thoughts for now
        const journalData = {
          date: currentDate,
          thoughts: journalContent,
          feelings: "", // Keep for compatibility
          missions: missions // Store missions in journal entry too
        };
        
        // Call the parent's onSave which handles the Supabase operation
        await onSave(journalData);
        
        toast({
          title: "Entry Saved",
          description: "Your journal entry has been saved successfully",
          action: <div className="h-8 w-8 bg-nature-sage/20 rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4 text-nature-brown" />
            </div>
        });

        // Clear journal content after saving
        setJournalContent("");
      }

      // Process missions separately if provided
      if (missions && missions.trim() !== "") {
        await processMissionsAsTasks(missions, currentDate, navigate);
        setMissions(""); // Clear missions after processing
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error Saving",
        description: "There was a problem saving your entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMissionsSubmit = async () => {
    if (!missions || missions.trim() === "") {
      toast({
        title: "No Missions",
        description: "Please write at least one mission before adding",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await processMissionsAsTasks(missions, currentDate, navigate);
      setMissions("");
      
      toast({
        title: "Missions Added",
        description: "Your weekly missions were added successfully",
      });
    } catch (error) {
      console.error("Error adding missions:", error);
      toast({
        title: "Error Adding Missions",
        description: "There was a problem adding your missions. Please try again.",
        variant: "destructive"
      });
    }
  };

  return <Card className="soft-card animate-fade-in">
      <CardHeader className="card-header">
        <CardTitle className="flex items-center gap-3">
          <Pencil className="h-6 w-6 text-nature-brown" />
          <span className="text-2xl text-nature-brown font-heading">New Journal Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-6">
        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-nature-beige p-1.5 rounded-lg">
            <TabsTrigger value="journal" className="data-[state=active]:active-tab soft-tab py-2.5 font-medium">
              Journal
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:active-tab soft-tab py-2.5 font-medium">
              Weekly Missions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="journal" className="mt-0">
            <JournalTab journalContent={journalContent} setJournalContent={setJournalContent} />
          </TabsContent>
          <TabsContent value="missions" className="mt-0">
            <MissionsTab missions={missions} setMissions={setMissions} handleMissionsSubmit={handleMissionsSubmit} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end bg-sage-gradient/30 py-6 px-8 rounded-b-xl">
        <Button onClick={handleSave} className="warm-button shadow-soft hover:translate-y-[-2px] font-medium px-6 py-5 text-base rounded-lg">
          Save Entry
        </Button>
      </CardFooter>
    </Card>;
}
