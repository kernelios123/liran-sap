
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListTodo, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, removeDuplicateTasks, groupTasksByWeek, formatWeeklyTasks } from "@/utils/taskUtils";
import { ActiveTasksSection } from "@/components/tasks/ActiveTasksSection";
import { CompletedTasksSection } from "@/components/tasks/CompletedTasksSection";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("journal-tasks");
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }));
          
          // Remove any potential duplicates before setting state
          const uniqueTasks = removeDuplicateTasks(parsedTasks);
          setTasks(uniqueTasks);
        } catch (error) {
          console.error("Error parsing tasks:", error);
          setTasks([]);
        }
      }
    };

    loadTasks();
  }, []);

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed",
    });
  };

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    setTasks(updatedTasks);
    localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
    toast({
      title: "Tasks Cleared",
      description: "Completed tasks have been removed",
    });
  };

  // Separate tasks into active and completed
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Group and format active tasks by week
  const groupedActiveTasks = formatWeeklyTasks(groupTasksByWeek(activeTasks));
  
  const totalActiveCount = activeTasks.length;
  const totalCompletedCount = completedTasks.length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
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
          <div className="mt-4 bg-[#F7F3EE] p-3 rounded-lg shadow-sm">
            <p className="text-[#7D5A50] flex items-center gap-2">
              <Save className="h-4 w-4 text-[#B56B45]" />
              <span>Progress: {totalCompletedCount}/{totalActiveCount + totalCompletedCount} tasks completed</span>
            </p>
          </div>
        </header>

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
            clearCompletedTasks={handleClearCompleted}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
