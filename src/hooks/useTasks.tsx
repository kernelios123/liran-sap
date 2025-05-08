
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Task, removeDuplicateTasks } from "@/utils/taskUtils";
import { supabase } from "@/integrations/supabase/client";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from Supabase
  useEffect(() => {
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
        const parsedTasks: Task[] = data.map((task) => ({
          id: task.id,
          text: task.text,
          completed: task.completed,
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

  // Toggle task completion status
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

  // Delete a task
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

  // Clear completed tasks
  const clearCompletedTasks = async () => {
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

  return {
    tasks,
    isLoading,
    toggleTask,
    deleteTask,
    clearCompletedTasks
  };
}
