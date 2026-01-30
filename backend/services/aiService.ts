import { GoogleGenAI, Type } from "@google/genai";

/**
 * AURA ENGINE (Adaptive Unified Reasoning Agent)
 * 
 * Orchestrates content transformation, domain classification, and 
 * pedagogical scaling using Google Gemini.
 */

// FIX: Strictly use API_KEY from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AuraGenerationParams {
  topic: string;
  rawContent: string;
  userInterest: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Helper to surgically extract JSON from LLM responses.
 * Handles cases where the AI adds conversational filler before/after the JSON.
 */
const cleanJsonOutput = (text: string): string => {
  if (!text) return "{}";
  
  // 1. Locate the JSON structure
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    // Fallback: simple trim if no braces found (unlikely for valid JSON)
    return text.trim();
  }

  // 2. Extract strictly the JSON part (From first { to last })
  // This automatically strips any markdown code blocks wrapping the JSON
  let clean = text.substring(firstBrace, lastBrace + 1);
  
  return clean.trim();
};

export const AuraEngine = {
  
  async generateLesson(params: AuraGenerationParams) {
    const { topic, rawContent, userInterest, difficulty = 'beginner' } = params;

    const systemInstruction = `
      You are AURA (Adaptive Unified Reasoning Agent).
      Objective: Transform raw educational content into a structured, gamified lesson plan AND strictly classify its academic domain for ranking fairness.

      TARGET AUDIENCE PROFILE:
      - Interest: ${userInterest} (Use metaphors/analogies from this world)
      - Difficulty Level: ${difficulty}

      MANDATORY RANKING LOGIC (Internal):
      1. Classify content into exactly one domain:
         - 'STEM' (Science, Tech, Engineering, Math)
         - 'Humanities' (History, Philosophy, Social Studies)
         - 'Arts' (Design, Music, Fine Arts)
         - 'Business' (Finance, Economics, Management)
         - 'Language' (Linguistics, Literature)
         - 'General' (Everything else)
      
      2. Assign a 'difficultyMultiplier' (1.0 to 1.5) based on cognitive load:
         - STEM / Complex Logic: 1.3 - 1.5
         - Business / Advanced Humanities: 1.1 - 1.3
         - General / Intro / Arts: 1.0 - 1.2

      OUTPUT:
      - JSON format only.
    `;

    const userPrompt = `
      TOPIC: ${topic}
      SOURCE MATERIAL: "${rawContent.substring(0, 20000)}"
      
      Generate the lesson plan. Ensure 'domain' and 'difficultyMultiplier' are accurate.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              domain: { type: Type.STRING, enum: ['STEM', 'Humanities', 'Arts', 'Business', 'Language', 'General'] },
              difficultyMultiplier: { type: Type.NUMBER, description: "Multiplier between 1.0 and 1.5" },
              estimatedTime: { type: Type.STRING },
              xpReward: { type: Type.INTEGER },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    visualPrompt: { type: Type.STRING },
                    keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    difficulty: { type: Type.INTEGER }
                  }
                }
              }
            }
          }
        }
      });

      if (!response.text) throw new Error("AURA Engine returned empty response");
      
      // Sanitization step for production stability
      const cleanJson = cleanJsonOutput(response.text);
      let data;
      try {
        data = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON Parse Failed on:", cleanJson);
        throw new Error("Failed to parse AI response");
      }
      
      return { ...data, interestUsed: userInterest };

    } catch (error) {
      console.error("AURA Engine Critical Failure:", error);
      throw new Error("Failed to generate lesson content via AURA.");
    }
  },

  async generateImage(prompt: string, style: string) {
    try {
      // Enhanced prompt engineering for better covers
      const enhancedPrompt = `
        A premium, artistic digital illustration for an educational app.
        Subject: ${prompt}
        Context: Educational lesson cover art.
        Art Style: ${style}, vibrant, clean lines, flat design, vector art, high resolution.
        No text, no words, no letters in the image.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: enhancedPrompt },
          ],
        },
        config: {
          // Gemini 2.5 Flash Image defaults
        },
      });

      // Extract image from response parts
      for (const candidate of response.candidates || []) {
        if (candidate.content?.parts) {
          for (const part of candidate.content.parts) {
             if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
             }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("AURA Image Generation Failed:", error);
      return null; // Fail gracefully
    }
  }
};