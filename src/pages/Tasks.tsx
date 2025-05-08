
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, Save, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

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

  // Separate tasks into active and completed
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Group active tasks by the week they were created
  const groupTasksByWeek = (taskList: Task[]) => {
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

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    setTasks(updatedTasks);
    localStorage.setItem("journal-tasks", JSON.stringify(updatedTasks));
    toast({
      title: "Tasks Cleared",
      description: "Completed tasks have been removed",
    });
  };

  const groupedActiveTasks = groupTasksByWeek(activeTasks);
  const sortedActiveWeeks = Object.keys(groupedActiveTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
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
            {completedTasks.length > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-sm text-[#B56B45] hover:text-[#C87C56] transition-colors"
              >
                Clear Completed
              </button>
            )}
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
          {sortedActiveWeeks.length === 0 ? (
            <Card className="border-[#D4B996]/40 shadow-md">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No active missions. Add weekly missions in your journal entries to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedActiveWeeks.map((weekKey) => {
              const weekStart = new Date(weekKey);
              const weekEnd = new Date(weekKey);
              weekEnd.setDate(weekStart.getDate() + 6);
              
              const weekTasks = groupedActiveTasks[weekKey];
              
              return (
                <Card key={weekKey} className="border-[#D4B996]/40 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#D4B996]/30 to-[#B6C199]/20 py-4">
                    <CardTitle className="text-[#7D5A50] flex justify-between items-center">
                      <span>
                        Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                        {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Badge variant="outline" className="bg-white/50">
                        {weekTasks.length} active
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-full max-h-[320px] pr-4">
                      <ul className="space-y-3">
                        {weekTasks.map((task) => (
                          <li key={task.id} className="flex items-start gap-3 p-2 hover:bg-[#F7F3EE] rounded-md transition-colors">
                            <Checkbox
                              id={task.id}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-0.5 border-[#B56B45] data-[state=checked]:bg-[#B56B45] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={task.id}
                              className="text-[#5A4A42] flex-1 cursor-pointer"
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

          {/* Completed Missions Section */}
          {completedTasks.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-[#7D5A50] flex items-center gap-3 mb-4">
                <CheckCheck className="h-6 w-6 text-[#6A994E]" />
                Completed Missions
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="completed-tasks" className="border-[#D4B996]/40 shadow-md overflow-hidden bg-white rounded-md">
                  <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-[#B6C199]/30 to-[#D4B996]/20 hover:no-underline">
                    <span className="flex justify-between items-center w-full">
                      <span className="text-[#7D5A50] font-medium">View all completed missions</span>
                      <Badge variant="outline" className="bg-white/50 ml-2">
                        {completedTasks.length} completed
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4">
                      <ScrollArea className="h-full max-h-[300px]">
                        <ul className="space-y-3">
                          {completedTasks.map((task) => (
                            <li key={task.id} className="flex items-start gap-3 p-2 hover:bg-[#F7F3EE] rounded-md transition-colors">
                              <Checkbox
                                id={`completed-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-0.5 border-[#6A994E] data-[state=checked]:bg-[#6A994E] data-[state=checked]:text-white"
                              />
                              <label
                                htmlFor={`completed-${task.id}`}
                                className="text-[#5A4A42] flex-1 cursor-pointer line-through text-muted-foreground"
                              >
                                {task.text}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
