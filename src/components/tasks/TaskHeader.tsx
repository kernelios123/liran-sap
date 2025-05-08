
import React from "react";
import { ListTodo } from "lucide-react";

export const TaskHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-4xl font-semibold text-[#7D5A50] flex items-center gap-3">
          <ListTodo className="h-8 w-8 text-[#B56B45]" />
          Weekly Missions
        </h1>
      </div>
      <p className="text-lg text-[#886F68] mt-2">
        Track your weekly goals and missions from your journal entries
      </p>
    </header>
  );
};
