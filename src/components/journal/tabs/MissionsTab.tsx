
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

type MissionsTabProps = {
  missions: string;
  setMissions: (missions: string) => void;
  handleMissionsSubmit: () => void;
};

export function MissionsTab({ missions, setMissions, handleMissionsSubmit }: MissionsTabProps) {
  return (
    <>
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
    </>
  );
}
