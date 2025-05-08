
import { JournalData } from "@/components/journal/JournalEntry";
import { generateGeminiResponse, GeminiMessage } from "./geminiApi";

export interface InsightData {
  moodAnalysis: string;
  recommendations: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }[];
  summary: string;
}

export async function generateInsights(entries: JournalData[], apiKey: string): Promise<InsightData | null> {
  if (!entries.length) return null;
  
  try {
    // Prepare data for Gemini
    const entriesData = entries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      thoughts: entry.thoughts || "",
      feelings: entry.feelings || "",
      missions: entry.missions || ""
    }));
    
    // Only send the 10 most recent entries to avoid token limits
    const recentEntries = entriesData.slice(0, 10);
    
    const promptMessages: GeminiMessage[] = [
      {
        role: "user",
        parts: [
          `As an AI journal assistant, analyze these journal entries and provide three insights: 
          1. A mood analysis summary (2-3 sentences)
          2. Three personalized recommendations based on the journal content (each with title, brief description, and priority level as "high", "medium", or "low")
          3. A brief overall summary (1-2 sentences)
          
          Format your response as valid JSON with this structure:
          {
            "moodAnalysis": "your analysis here",
            "recommendations": [
              { "title": "recommendation 1", "description": "details", "priority": "high" },
              { "title": "recommendation 2", "description": "details", "priority": "medium" },
              { "title": "recommendation 3", "description": "details", "priority": "low" }
            ],
            "summary": "overall summary here"
          }
          
          Don't include any other text before or after the JSON. Here are the journal entries:
          ${JSON.stringify(recentEntries)}`
        ]
      }
    ];

    const response = await generateGeminiResponse(promptMessages, apiKey);
    
    // Extract JSON from response
    const jsonMatch = response.match(/({[\s\S]*})/);
    if (!jsonMatch) {
      console.error("No valid JSON found in response", response);
      return null;
    }
    
    try {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse;
    } catch (e) {
      console.error("Failed to parse JSON from response:", e);
      return null;
    }
  } catch (error) {
    console.error("Error generating insights:", error);
    return null;
  }
}
