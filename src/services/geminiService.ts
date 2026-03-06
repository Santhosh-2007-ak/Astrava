import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = "gemini-3-flash-preview";

export async function analyzeMedicalCase(data: {
  image: File | null;
  report: File | null;
  symptoms: string[];
  additionalSymptoms: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please ensure it is set in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are a world-class medical AI diagnostic assistant. 
  Your task is to analyze medical images, lab reports, and symptoms to provide a preliminary diagnosis.
  
  CRITICAL RULES:
  1. Be concise. Do NOT echo back raw data or base64 strings.
  2. Provide structured JSON only.
  3. Focus on clinical reasoning.
  4. If data is missing, provide the best assessment possible with the available info.
  5. Do NOT exceed 2000 tokens in your response.`;

  const parts: any[] = [
    { text: `Analyze this medical case. 
    Symptoms: ${data.symptoms.join(", ")}. 
    Additional Info: ${data.additionalSymptoms}.` }
  ];

  if (data.image) {
    const base64Image = await fileToBase64(data.image);
    parts.push({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: data.image.type
      }
    });
  }

  if (data.report) {
    // If it's a PDF, we might need to handle it differently if the model doesn't support it directly as inlineData
    // But Gemini 1.5+ supports PDF. Let's try.
    const base64Report = await fileToBase64(data.report);
    parts.push({
      inlineData: {
        data: base64Report.split(',')[1],
        mimeType: data.report.type
      }
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnoses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                risk: { type: Type.STRING }
              },
              required: ["name", "confidence", "risk"]
            }
          },
          explanation: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          labFindings: {
            type: Type.OBJECT,
            properties: {
              WBC: { type: Type.STRING },
              Hemoglobin: { type: Type.STRING },
              Platelets: { type: Type.STRING }
            }
          },
          heatmapDescription: { type: Type.STRING }
        },
        required: ["diagnoses", "explanation", "recommendations", "labFindings"]
      }
    }
  });

  const text = response.text || "{}";
  try {
    // Clean up text in case of markdown or other formatting
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Raw Text:", text);
    // If it's a truncation error, try to fix it or return a partial object
    if (text.length > 100) {
      // Very crude attempt to close a truncated JSON object
      try {
        const partial = text.substring(0, text.lastIndexOf('}')) + '}]}';
        return JSON.parse(partial);
      } catch (inner) {
        throw new Error("The AI response was too large and could not be parsed. Please try with less data or more specific symptoms.");
      }
    }
    throw new Error("Failed to parse AI response. Please try again.");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
