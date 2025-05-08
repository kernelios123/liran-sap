
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListTodo, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, removeDuplicateTasks, groupTasksByWeek, formatWeeklyTasks } from "@/utils/taskUtils";
import { ActiveTasksSection } from "@/components/tasks/ActiveTasksSection";
import { CompletedTasksSection } from "@/components/tasks/CompletedTasksSection";
import { supabase } from "@/integrations/supabase/client";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from Supabase
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert string dates to Date objects
        const parsedTasks = data.map((task) => ({
          ...task,
          date: new Date(task.date),
        }));
        
        // Remove any potential duplicates before setting state
        const uniqueTasks = removeDuplicateTasks(parsedTasks);
        setTasks(uniqueTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error Loading Tasks",
          description: "There was a problem loading your tasks.",
          variant: "destructive"
        });
        
        // Fallback to localStorage
        try {
          const savedTasks = localStorage.getItem("journal-tasks");
          if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
              ...task,
              date: new Date(task.date),
            }));
            
            // Remove any potential duplicates before setting state
            const uniqueTasks = removeDuplicateTasks(parsedTasks);
            setTasks(uniqueTasks);
          }
        } catch (localError) {
          console.error("Error parsing local tasks:", localError);
          setTasks([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  const toggleTask = async (taskId: string) => {
    try {
      // Find the task to toggle
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      // Update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToUpdate.completed })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Error Updating Task",
        description: "There was a problem updating the task status.",
        variant: "destructive"
      });
      
      // Fallback to localStorage update
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== taskId);
        return updatedTasks;
      });
      
      toast({
        title: "Task Deleted",
        description: "The task has been removed",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error Deleting Task",
        description: "There was a problem deleting the task.",
        variant: "destructive"
      });
      
      // Fallback to localStorage
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== taskId);
        localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    }
  };

  const handleClearCompleted = async () => {
    try {
      // Get IDs of completed tasks
      const completedTaskIds = tasks.filter(task => task.completed).map(task => task.id);
      
      if (completedTaskIds.length === 0) return;
      
      // Delete completed tasks from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
        
      if (error) throw error;
      
      // Update local state
      const updatedTasks = tasks.filter(task => !task.completed);
      setTasks(updatedTasks);
      
      toast({
        title: "Tasks Cleared",
        description: "Completed tasks have been removed",
      });
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      toast({
        title: "Error Clearing Tasks",
        description: "There was a problem removing completed tasks.",
        variant: "destructive"
      });
      
      // Fallback to localStorage
      const updatedTasks = tasks.filter(task => !task.completed);
      setTasks(updatedTasks);
      localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
    }
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
              clearCompletedTasks={handleClearCompleted}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TasksPage;
