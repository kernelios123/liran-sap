
import { toast } from "@/hooks/use-toast";

// Function to process mission texts into tasks
export function processMissionsAsTasks(missionText: string, date: Date, navigate: (path: string) => void) {
  // Check if there are missions to process
  if (!missionText || missionText.trim() === "") return;
  
  // Get existing tasks
  const savedTasks = localStorage.getItem("journal-tasks");
  let existingTasks = savedTasks ? JSON.parse(savedTasks) : [];
  
  // Process missions into tasks
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
  
  // Save back to localStorage
  localStorage.setItem("journal-tasks", JSON.stringify(allTasks));
  
  // Show notification and navigate to tasks page
  if (newTasks.length > 0) {
    toast({
      title: "Tasks Created",
      description: `${newTasks.length} mission${newTasks.length > 1 ? 's' : ''} added to your tasks list`,
    });
    navigate("/tasks");
  }
}
