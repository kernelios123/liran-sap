
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskItem } from "./TaskItem";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, CheckCheck } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

interface CompletedTasksSectionProps {
  completedTasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompletedTasks: () => void;
}

export const CompletedTasksSection = ({ 
  completedTasks, 
  toggleTask, 
  deleteTask,
  clearCompletedTasks 
}: CompletedTasksSectionProps) => {
  if (completedTasks.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#7D5A50] flex items-center gap-3">
          <CheckCheck className="h-6 w-6 text-[#6A994E]" />
          Completed Missions
        </h2>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="text-sm border-[#B56B45] text-[#B56B45] hover:bg-[#B56B45]/10 hover:text-[#B56B45]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your completed missions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={clearCompletedTasks}
                className="bg-[#B56B45] hover:bg-[#C87C56]"
              >
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="completed-tasks" className="border-[#D4B996]/40 shadow-md overflow-hidden bg-white rounded-md">
          <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-[#B6C199]/30 to-[#D4B996]/20 hover:no-underline">
            <span className="flex justify-between items-center w-full">
              <span className="text-[#7D5A50] font-medium">View all completed missions</span>
              <Badge variant="outline" className="bg-white/50 ml-2">
                {completedTasks.length} completed
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <ScrollArea className="h-full max-h-[300px]">
                <ul className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      isCompleted={true}
                    />
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
