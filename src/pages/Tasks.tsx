
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { groupTasksByWeek, formatWeeklyTasks } from "@/utils/taskUtils";
import { ActiveTasksSection } from "@/components/tasks/ActiveTasksSection";
import { CompletedTasksSection } from "@/components/tasks/CompletedTasksSection";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskStats } from "@/components/tasks/TaskStats";
import { useTasks } from "@/hooks/useTasks";

const TasksPage = () => {
  const { tasks, isLoading, toggleTask, deleteTask, clearCompletedTasks } = useTasks();
  
  // Separate tasks into active and completed
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Group and format active tasks by week
  const groupedActiveTasks = formatWeeklyTasks(groupTasksByWeek(activeTasks));

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <TaskHeader />
        
        <TaskStats 
          activeCount={activeTasks.length} 
          completedCount={completedTasks.length} 
        />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-nature-brown">Loading tasks...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Missions */}
            <ActiveTasksSection 
              groupedActiveTasks={groupedActiveTasks} 
              toggleTask={toggleTask} 
            />

            {/* Completed Missions */}
            <CompletedTasksSection 
              completedTasks={completedTasks}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              clearCompletedTasks={clearCompletedTasks}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TasksPage;
