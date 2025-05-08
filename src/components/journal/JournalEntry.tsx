
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

  const handleSave = () => {
    if (!thoughts && !feelings && !missions) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving",
        variant: "destructive",
      });
      return;
    }

    onSave({
      date: currentDate,
      thoughts,
      feelings,
      missions,
    });

    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved",
      action: (
        <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <Leaf className="h-4 w-4 text-nature-leaf" />
        </div>
      ),
    });

    // Clear form after saving
    setThoughts("");
    setFeelings("");
    setMissions("");
  };

  return (
    <Card className="w-full shadow-md border-nature-sand/30 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-nature-moss/10 to-nature-sky/5 rounded-t-md">
        <CardTitle className="flex items-center gap-2">
          <Pencil className="h-5 w-5 text-nature-forest" />
          <span>New Journal Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="thoughts" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="thoughts">Thoughts</TabsTrigger>
            <TabsTrigger value="feelings">Feelings</TabsTrigger>
            <TabsTrigger value="missions">Weekly Missions</TabsTrigger>
          </TabsList>
          <TabsContent value="thoughts" className="mt-0">
            <Textarea
              placeholder="Write your thoughts for today..."
              className={cn(
                "min-h-[200px] resize-none focus-visible:ring-nature-leaf",
                "bg-white/50 border-nature-sand/30"
              )}
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="feelings" className="mt-0">
            <Textarea
              placeholder="How are you feeling today?"
              className={cn(
                "min-h-[200px] resize-none focus-visible:ring-nature-leaf",
                "bg-white/50 border-nature-sand/30"
              )}
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="missions" className="mt-0">
            <Textarea
              placeholder="What are your missions for this week?"
              className={cn(
                "min-h-[200px] resize-none focus-visible:ring-nature-leaf",
                "bg-white/50 border-nature-sand/30"
              )}
              value={missions}
              onChange={(e) => setMissions(e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end bg-secondary/30 rounded-b-md">
        <Button onClick={handleSave} className="bg-nature-forest hover:bg-nature-forest/90">
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
