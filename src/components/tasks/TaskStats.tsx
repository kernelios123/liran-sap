
import React from "react";
import { Save } from "lucide-react";

interface TaskStatsProps {
  activeCount: number;
  completedCount: number;
}

export const TaskStats = ({ activeCount, completedCount }: TaskStatsProps) => {
  const totalCount = activeCount + completedCount;
  
  return (
    <div className="mt-4 bg-[#F7F3EE] p-3 rounded-lg shadow-sm">
      <p className="text-[#7D5A50] flex items-center gap-2">
        <Save className="h-4 w-4 text-[#B56B45]" />
        <span>Progress: {completedCount}/{totalCount} tasks completed</span>
      </p>
    </div>
  );
};
