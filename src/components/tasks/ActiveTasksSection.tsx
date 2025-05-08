
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TaskItem } from "./TaskItem";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

interface WeekTasks {
  weekKey: string;
  weekStart: Date;
  weekEnd: Date;
  tasks: Task[];
}

interface ActiveTasksSectionProps {
  groupedActiveTasks: WeekTasks[];
  toggleTask: (id: string) => void;
}

export const ActiveTasksSection = ({ groupedActiveTasks, toggleTask }: ActiveTasksSectionProps) => {
  if (groupedActiveTasks.length === 0) {
    return (
      <Card className="border-[#D4B996]/40 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            No active missions. Add weekly missions in your journal entries to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {groupedActiveTasks.map(({ weekKey, weekStart, weekEnd, tasks }) => (
        <Card key={weekKey} className="border-[#D4B996]/40 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#D4B996]/30 to-[#B6C199]/20 py-4">
            <CardTitle className="text-[#7D5A50] flex justify-between items-center">
              <span>
                Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <Badge variant="outline" className="bg-white/50">
                {tasks.length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ScrollArea className="h-full max-h-[320px] pr-4">
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                  />
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
