
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  isCompleted?: boolean;
}

export const TaskItem = ({ task, onToggle, onDelete, isCompleted = false }: TaskItemProps) => {
  return (
    <li className="flex items-start gap-3 p-2 hover:bg-[#F7F3EE] rounded-md transition-colors">
      <Checkbox
        id={isCompleted ? `completed-${task.id}` : task.id}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className={`mt-0.5 ${isCompleted ? "border-[#6A994E] data-[state=checked]:bg-[#6A994E]" : "border-[#B56B45] data-[state=checked]:bg-[#B56B45]"} data-[state=checked]:text-white`}
      />
      <label
        htmlFor={isCompleted ? `completed-${task.id}` : task.id}
        className={`text-[#5A4A42] flex-1 cursor-pointer ${isCompleted ? "line-through text-muted-foreground" : ""}`}
      >
        {task.text}
      </label>
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 text-[#B56B45] hover:text-[#C87C56] hover:bg-[#F7F3EE]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      )}
    </li>
  );
};
