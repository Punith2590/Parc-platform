
import { GoogleGenAI, Type } from '@google/genai';
import type { AssessmentQuestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const testSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: "An array of test questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers.",
            items: {
              type: Type.STRING
            }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer from the options array."
          }
        },
        required: ["question", "options", "correctAnswer"]
      }
    }
  },
  required: ["questions"]
};

const assignmentSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise title for the assignment."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of 3 to 5 open-ended assignment questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The open-ended question text."
          }
        },
        required: ["question"]
      }
    }
  },
  required: ["title", "questions"]
};


export const generateTest = async (materialContent: string): Promise<AssessmentQuestion[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following content, generate a 5-question multiple-choice test. Each question must have exactly 4 options. Ensure the correct answer is one of the options. Content: "${materialContent}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: testSchema,
      },
    });

    const jsonText = response.text;
    const parsed = JSON.parse(jsonText);
    
    if (parsed && Array.isArray(parsed.questions)) {
      return parsed.questions as AssessmentQuestion[];
    } else {
      console.error("Unexpected response structure from Gemini API:", parsed);
      throw new Error("Failed to generate a valid test.");
    }

  } catch (error) {
    console.error("Error generating test with Gemini API:", error);
    throw new Error("Could not generate test. Please check the content or API configuration.");
  }
};

export const generateAssignment = async (materialContent: string): Promise<{ title: string; questions: { question: string }[] }> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following content, generate a 3-question open-ended assignment. Create a suitable title for the assignment. Content: "${materialContent}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: assignmentSchema,
      },
    });

    const jsonText = response.text;
    const parsed = JSON.parse(jsonText);
    
    if (parsed && parsed.title && Array.isArray(parsed.questions)) {
      return parsed;
    } else {
      console.error("Unexpected response structure from Gemini API for assignment:", parsed);
      throw new Error("Failed to generate a valid assignment.");
    }

  } catch (error) {
    console.error("Error generating assignment with Gemini API:", error);
    throw new Error("Could not generate assignment. Please check the content or API configuration.");
  }
};