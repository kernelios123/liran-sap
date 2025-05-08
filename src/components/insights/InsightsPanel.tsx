
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JournalData } from "../journal/JournalEntry";
import { BarChart, BarChartHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type InsightsPanelProps = {
  entries: JournalData[];
};

type MoodData = {
  positive: number;
  neutral: number;
  negative: number;
};

type Recommendation = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};

export function InsightsPanel({ entries }: InsightsPanelProps) {
  // For demo purposes, we'll generate mock insights
  const moodData: MoodData = {
    positive: entries.length > 0 ? Math.floor(Math.random() * 50) + 30 : 0,
    neutral: entries.length > 0 ? Math.floor(Math.random() * 30) + 10 : 0,
    negative: entries.length > 0 ? Math.floor(Math.random() * 20) : 0,
  };

  const totalMood = moodData.positive + moodData.neutral + moodData.negative;

  const recommendations: Recommendation[] = [
    {
      title: "Morning Nature Walk",
      description: "Your entries show better mood when you spend time outdoors. Consider a morning walk in nature.",
      priority: "high",
    },
    {
      title: "Journal Consistency",
      description: "You've been consistent with your journaling. Keep it up for better insights.",
      priority: "medium",
    },
    {
      title: "Reflection Time",
      description: "Set aside 10 minutes each evening to reflect on the day's positive moments.",
      priority: "low",
    },
  ];

  const priorityColorMap = {
    high: "bg-green-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood">
          <Card className="shadow-md border-nature-sand/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-nature-forest" />
                <span>Mood Insights</span>
              </CardTitle>
              <CardDescription>
                Analysis based on {entries.length} journal entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positive Mood</span>
                      <span>{Math.round((moodData.positive / totalMood) * 100)}%</span>
                    </div>
                    <Progress value={(moodData.positive / totalMood) * 100} className="h-2 bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Neutral Mood</span>
                      <span>{Math.round((moodData.neutral / totalMood) * 100)}%</span>
                    </div>
                    <Progress value={(moodData.neutral / totalMood) * 100} className="h-2 bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Negative Mood</span>
                      <span>{Math.round((moodData.negative / totalMood) * 100)}%</span>
                    </div>
                    <Progress value={(moodData.negative / totalMood) * 100} className="h-2 bg-muted" />
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <h4 className="font-medium mb-2">Journal Activity</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've journaled {entries.length} {entries.length === 1 ? 'time' : 'times'} in total.
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }).map((_, i) => {
                        // For demo purposes, randomly determine if there's an entry for this day
                        const hasEntry = i < entries.length;
                        const intensity = hasEntry 
                          ? Math.floor(Math.random() * 3) + 1 
                          : 0;
                        
                        return (
                          <div 
                            key={i}
                            className={cn(
                              "h-4 rounded-sm",
                              intensity === 0 && "bg-muted",
                              intensity === 1 && "bg-nature-leaf/30",
                              intensity === 2 && "bg-nature-leaf/60",
                              intensity === 3 && "bg-nature-leaf"
                            )}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Add journal entries to see mood insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card className="shadow-md border-nature-sand/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartHorizontal className="h-5 w-5 text-nature-forest" />
                <span>Personalized Recommendations</span>
              </CardTitle>
              <CardDescription>
                Based on your journaling patterns and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 border rounded-md bg-white">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full mt-1",
                          priorityColorMap[recommendation.priority]
                        )}
                      />
                      <div>
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Add journal entries to get personalized recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
