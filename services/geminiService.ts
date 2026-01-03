
import { GoogleGenAI } from "@google/genai";

export async function generateTestInsights(
  testTitle: string, 
  score: number, 
  maxScore: number, 
  breakdown: any,
  richAnswers?: Record<string, string | number>
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Act as a friendly, encouraging mental health coach (similar style to Headspace or Calm). 
      Analyze the user's test results simply and clearly.

      Test: ${testTitle}
      Score: ${score} out of ${maxScore}
      Breakdown: ${JSON.stringify(breakdown)}
      Specific User Responses: ${JSON.stringify(richAnswers || {})}
      
      Requirements:
      1. DO NOT use clinical jargon or complex medical terms. Keep it very simple.
      2. If "Specific User Responses" contains text answers or specific choices, REFERENCE THEM in your advice to make it feel personal. (e.g., "You mentioned that you enjoy solitude...")
      3. Start with 1-2 sentences summarizing their current state in a warm tone.
      4. Provide exactly 3 bullet points for "Key Strengths".
      5. Provide exactly 3 bullet points for "Simple Actions to Try".
      6. DO NOT diagnose.
      
      Format the response with Markdown headers (##) for readability.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "We couldn't generate a summary right now, but your scores are available below.";
  } catch (error) {
    console.error("Gemini Insight Generation Error:", error);
    return "Our AI coach is currently taking a break. Please check your scores below.";
  }
}

export async function chatWithBusinessCoach(
  message: string,
  companyContext: {
    companyName: string;
    employees: any[];
    logs: any[];
    currentFocus: string;
  },
  chatHistory: { role: string; text: string }[]
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `
      You are the Chief Wellness Officer AI for "${companyContext.companyName}".
      
      Your Goal: Assist the admin in managing employee well-being, analyzing test data, and suggesting workplace interventions.
      
      Current Data Context:
      - Weekly Focus: ${companyContext.currentFocus}
      - Employee Roster: ${JSON.stringify(companyContext.employees.map(e => ({ name: e.name, dept: e.department, score: e.wellnessScore, status: e.status, tasks: e.assignedTasks })))}
      - Recent Activity Logs: ${JSON.stringify(companyContext.logs)}

      Guidelines:
      1. Be professional, strategic, yet empathetic.
      2. Use the provided data to answer questions. If asked "Who is struggling?", look for low wellness scores (<50) or "Needs Attention" status.
      3. Suggest actionable interventions (e.g., "Schedule a team break", "Assign the 'Burnout' protocol").
      4. Keep responses concise (under 100 words unless detailed analysis is requested).
      5. Do not make up data. If data is missing, say so.
    `;

    let conversation = "";
    chatHistory.forEach(msg => {
      conversation += `${msg.role === 'user' ? 'Admin' : 'AI'}: ${msg.text}\n`;
    });

    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversation}\nAdmin: ${message}\nAI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text || "I'm analyzing the data but couldn't generate a response.";
  } catch (error) {
    console.error("Business Coach Error:", error);
    return "I'm having trouble connecting to the neural network right now.";
  }
}
