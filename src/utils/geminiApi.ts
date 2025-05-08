
// Utility functions for working with Google's Gemini API

export type GeminiMessage = {
  role: "user" | "model";
  parts: string[];
};

export async function generateGeminiResponse(
  messages: GeminiMessage[], 
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(part => ({ text: part })),
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return "I'm having trouble connecting to my knowledge base. Please check your API key or try again later.";
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}
