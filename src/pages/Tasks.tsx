import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  // Helper function to remove duplicate tasks based on text content
  const removeDuplicateTasks = (taskList: Task[]): Task[] => {
    const uniqueMap = new Map();
    
    // Keep only the first occurrence of each task text
    taskList.forEach(task => {
      if (!uniqueMap.has(task.text)) {
        uniqueMap.set(task.text, task);
      }
    });
    
    return Array.from(uniqueMap.values());
  };

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  // Group tasks by the week they were created
  const groupTasksByWeek = () => {
    const groupedTasks: { [weekKey: string]: Task[] } = {};
    
    tasks.forEach(task => {
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

  const groupedTasks = groupTasksByWeek();
  const sortedWeeks = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold text-[#7D5A50] flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-[#B56B45]" />
            Weekly Missions
          </h1>
          <p className="text-lg text-[#886F68] mt-2">
            Track your weekly goals and missions from your journal entries
          </p>
        </header>

        <div className="space-y-8">
          {sortedWeeks.length === 0 ? (
            <Card className="border-[#D4B996]/40 shadow-md">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No tasks found. Add weekly missions in your journal entries to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedWeeks.map((weekKey) => {
              const weekStart = new Date(weekKey);
              const weekEnd = new Date(weekKey);
              weekEnd.setDate(weekStart.getDate() + 6);
              
              return (
                <Card key={weekKey} className="border-[#D4B996]/40 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#D4B996]/30 to-[#B6C199]/20 py-4">
                    <CardTitle className="text-[#7D5A50] flex justify-between items-center">
                      <span>
                        Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                        {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Badge variant="outline" className="bg-white/50">
                        {groupedTasks[weekKey].filter(t => t.completed).length}/{groupedTasks[weekKey].length} completed
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-full max-h-[320px] pr-4">
                      <ul className="space-y-3">
                        {groupedTasks[weekKey].map((task) => (
                          <li key={task.id} className="flex items-start gap-3 p-2 hover:bg-[#F7F3EE] rounded-md transition-colors">
                            <Checkbox
                              id={task.id}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-0.5 border-[#B56B45] data-[state=checked]:bg-[#B56B45] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={task.id}
                              className={`text-[#5A4A42] flex-1 cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
