
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Function to process mission texts into tasks
export async function processMissionsAsTasks(missionText: string, date: Date, navigate: (path: string) => void) {
  // Check if there are missions to process
  if (!missionText || missionText.trim() === "") return;
  
  try {
    // Process missions into tasks
    const missionLines = missionText
      .split("\n")
      .filter(line => line.trim() !== "");
    
    // Fetch existing tasks from Supabase to avoid duplicates
    const { data: existingTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('text')
      .eq('completed', false);

    if (fetchError) throw fetchError;

    const existingTaskTexts = existingTasks?.map(task => task.text) || [];
    
    // Filter out duplicate missions
    const uniqueMissions = missionLines.filter(line => 
      !existingTaskTexts.includes(line.trim())
    );
    
    if (uniqueMissions.length === 0) {
      toast({
        title: "No New Tasks",
        description: "These missions are already in your tasks list."
      });
      return;
    }
    
    // Prepare tasks for insertion
    const newTasks = uniqueMissions.map(line => ({
      id: uuidv4(),
      text: line.trim(),
      completed: false,
      date: date.toISOString(),
    }));
    
    // Insert new tasks into Supabase
    const { error: insertError } = await supabase
      .from('tasks')
      .insert(newTasks);
      
    if (insertError) throw insertError;
    
    // Show notification and navigate to tasks page
    toast({
      title: "Tasks Created",
      description: `${newTasks.length} mission${newTasks.length > 1 ? 's' : ''} added to your tasks list`,
    });
    
    // Navigate to tasks page
    navigate("/tasks");
    
  } catch (error) {
    console.error('Error processing missions as tasks:', error);
    toast({
      title: "Error Creating Tasks",
      description: "There was a problem adding your missions to tasks.",
      variant: "destructive"
    });
    
    // Fallback to localStorage if Supabase fails
    const savedTasks = localStorage.getItem("journal-tasks");
    let existingTasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    const missionLines = missionText
      .split("\n")
      .filter(line => line.trim() !== "");
    
    const newTasks = missionLines.map(line => ({
      id: `${date.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      text: line.trim(),
      completed: false,
      date: date,
    }));
    
    // Add only new tasks (avoid duplicates)
    const allTasks = [...existingTasks];
    
    newTasks.forEach(newTask => {
      const isDuplicate = existingTasks.some((existingTask: any) => 
        existingTask.text === newTask.text
      );
      
      if (!isDuplicate) {
        allTasks.push(newTask);
      }
    });
    
    // Save back to localStorage as fallback
    localStorage.setItem("journal-tasks", JSON.stringify(allTasks));
    
    // Show notification and navigate to tasks page
    if (newTasks.length > 0) {
      toast({
        title: "Tasks Created",
        description: `${newTasks.length} mission${newTasks.length > 1 ? 's' : ''} added to your tasks list (saved locally)`,
      });
      navigate("/tasks");
    }
  }
}
