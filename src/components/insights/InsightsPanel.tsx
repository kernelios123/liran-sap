
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JournalData } from "../journal/JournalEntry";
import { BarChart, BarChartHorizontal, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { generateInsights, InsightData } from "@/utils/insightGenerator";
import { Button } from "../ui/button";

type InsightsPanelProps = {
  entries: JournalData[];
};

export function InsightsPanel({ entries }: InsightsPanelProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll still generate mock mood data if Gemini fails
  const moodData = {
    positive: entries.length > 0 ? Math.floor(Math.random() * 50) + 30 : 0,
    neutral: entries.length > 0 ? Math.floor(Math.random() * 30) + 10 : 0,
    negative: entries.length > 0 ? Math.floor(Math.random() * 20) : 0,
  };

  const totalMood = moodData.positive + moodData.neutral + moodData.negative;

  const fetchInsights = async () => {
    if (entries.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Using a fixed API key for demo purposes
      const apiKey = "AIzaSyAQo8RQg4g4lU2FWjm-VK0VYcGX0jWFX0w";
      const aiInsights = await generateInsights(entries, apiKey);
      
      if (aiInsights) {
        setInsights(aiInsights);
      } else {
        setError("Could not generate insights. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("An error occurred while generating insights.");
    } finally {
      setLoading(false);
    }
  };

  // Generate insights when entries change
  useEffect(() => {
    if (entries.length > 0) {
      fetchInsights();
    }
  }, [entries.length]); // Only re-run when the number of entries changes

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
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <Sparkles className="h-8 w-8 text-nature-forest mb-2" />
                    <p className="text-muted-foreground">Generating AI insights...</p>
                  </div>
                </div>
              )}
              
              {error && !loading && (
                <div className="text-center py-4">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={fetchInsights} variant="outline">Try Again</Button>
                </div>
              )}
              
              {entries.length > 0 && insights?.moodAnalysis && !loading ? (
                <div className="space-y-4">
                  <div className="p-4 bg-nature-leaf/10 rounded-md">
                    <p className="text-nature-forest">{insights.moodAnalysis}</p>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Mood Distribution</h4>
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
                    </div>
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
              ) : !loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Add journal entries to see mood insights</p>
                </div>
              ) : null}
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
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <Sparkles className="h-8 w-8 text-nature-forest mb-2" />
                    <p className="text-muted-foreground">Generating AI recommendations...</p>
                  </div>
                </div>
              )}
              
              {error && !loading && (
                <div className="text-center py-4">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={fetchInsights} variant="outline">Try Again</Button>
                </div>
              )}
              
              {entries.length > 0 && insights?.recommendations && !loading ? (
                <div className="space-y-4">
                  {insights.summary && (
                    <div className="p-4 bg-nature-leaf/10 rounded-md mb-4">
                      <p className="text-nature-forest">{insights.summary}</p>
                    </div>
                  )}
                  
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 border rounded-md bg-white">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full mt-1",
                          priorityColorMap[recommendation.priority as keyof typeof priorityColorMap]
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
              ) : !loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Add journal entries to get personalized recommendations</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
