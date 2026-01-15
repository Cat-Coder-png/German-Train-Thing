
import { GoogleGenAI, Type } from "@google/genai";
import { Train, NetworkStatus } from "../types";

export class GeminiRailService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeNetworkStatus(trains: Train[], networkStatus: NetworkStatus): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert rail dispatcher for Deutsche Bahn. 
        Current network state:
        - Active Trains: ${trains.length}
        - Punctuality: ${networkStatus.onTimePercentage}%
        - Active Disruptions: ${networkStatus.majorDisruptions.join(', ')}
        
        Provide a concise, professional summary (max 3 sentences) of the current rail situation in Germany for a live dashboard.`,
      });
      return response.text || "Network status stable. All systems operational.";
    } catch (error) {
      console.error("Gemini analysis failed", error);
      return "Unable to retrieve AI network analysis at this time.";
    }
  }

  async getAssistantResponse(query: string, context: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: You are Casey's ZugRadar AI, a specialized assistant for the German rail network. 
        Current Status Context: ${context}
        User Query: ${query}
        
        Answer the query in a helpful, informative way. If the user asks about specific trains or routes not mentioned, use your general knowledge of German rail operations to provide a realistic simulation or helpful advice.`,
      });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      return "The rail assistant is currently offline. Please try again later.";
    }
  }
}
