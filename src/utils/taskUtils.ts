
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  user_id?: string;
  created_at?: string;
}

export const removeDuplicateTasks = (taskList: Task[]): Task[] => {
  const uniqueMap = new Map();
  
  // Keep only the first occurrence of each task text
  taskList.forEach(task => {
    if (!uniqueMap.has(task.text)) {
      uniqueMap.set(task.text, task);
    }
  });
  
  return Array.from(uniqueMap.values());
};

export const groupTasksByWeek = (taskList: Task[]) => {
  const groupedTasks: { [weekKey: string]: Task[] } = {};
  
  taskList.forEach(task => {
    const taskDate = new Date(task.date);
    const startOfWeek = new Date(taskDate);
    startOfWeek.setDate(taskDate.getDate() - taskDate.getDay()); // Go to the start of the week (Sunday)
    const weekKey = startOfWeek.toISOString().split('T')[0];
    
    if (!groupedTasks[weekKey]) {
      groupedTasks[weekKey] = [];
    }
    groupedTasks[weekKey].push(task);
  });
  
  return groupedTasks;
};

export const formatWeeklyTasks = (groupedTasks: { [weekKey: string]: Task[] }) => {
  // Convert grouped tasks to array format with week info
  return Object.keys(groupedTasks)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(weekKey => {
      const weekStart = new Date(weekKey);
      const weekEnd = new Date(weekKey);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return {
        weekKey,
        weekStart,
        weekEnd,
        tasks: groupedTasks[weekKey]
      };
    });
};
