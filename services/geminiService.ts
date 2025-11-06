import { GoogleGenAI, Part } from "@google/genai";
import { Settings } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the key is not set.
  // In a real build process, this would be populated.
  // For this context, we will mock it if it doesn't exist to avoid runtime errors.
  process.env.API_KEY = "YOUR_API_KEY_HERE";
}


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizePrompt = async (
  basePrompt: string,
  settings: Settings,
  hasImage: boolean
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are an expert prompt engineer for a high-fidelity, photorealistic AI image generator. Your signature style emphasizes ${settings.culturalFocus}, cinematic lighting, and controlled composition. Your output MUST be a single block of text, which is the final, optimized prompt, ready to be copied. Do not add any conversational text, explanations, or markdown formatting like \`\`\`.`;

  const userPrompt = `
    Base idea: "${basePrompt}"

    Strict parameters to incorporate:
    - Output Style: ${settings.outputStyle}
    - Perspective: ${settings.perspective}
    - Lighting: ${settings.lighting}
    - Cultural Focus: ${settings.culturalFocus}
    ${hasImage ? "- An image was provided for style, color, and composition reference." : ""}

    Follow this exact structure for the final prompt:
    1. **Quality Modifiers (PREPENDED):** Start with "Masterpiece, hyperdetailed, 8k, editorial photography, highly polished,".
    2. **Subject & Environment:** Refine the base idea. Be specific about the subject's ethnicity/culture (${settings.culturalFocus}), their attire (e.g., "sleek senator wear in rich kente cloth"), and place them in a clean, minimalist environment (e.g., "on a matte black surface", "with royal blue reflections", "no text or logos in the background").
    3. **Composition:** Inject technical terms for perspective like "${settings.perspective}". If the base prompt is vague, default to "Centered, Symmetrical composition". Always include "Shallow Depth of Field".
    4. **Lighting & Mood:** Use terms that match "${settings.lighting}". Be specific, like "Cinematic side lighting", "Volumetric light", and "soft, diffused shadows". Enforce mood terms like "Luxurious", "Refined", "Dramatic".
    5. **Image Reference (if applicable):** If a reference image was provided, add tags like "--style_ref --color_ref" at the very end.

    Now, generate the single, complete, optimized prompt for the base idea provided.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to optimize prompt. Please check your API key and try again.");
  }
};


export const generatePromptFromImage = async (
  imagePart: Part
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const prompt = `Analyze the provided image in detail. As an expert prompt engineer, generate a rich, descriptive text prompt suitable for an AI image generator. The prompt must be a single block of text without any other explanations or markdown.

  Follow these style conventions:
  - Style: Photorealistic, cinematic, luxurious, and refined.
  - Core Elements: Focus on subject, environment, perspective, lighting, and color.

  Your analysis should include:
  - Subject: Describe the person(s) or main focus, including perceived ethnicity, high-fashion or culturally specific clothing, pose, and expression.
  - Environment: Detail the background, props, textures. Emphasize clean, minimalist, or atmospheric surfaces. Note if there should be 'no text or logos'.
  - Perspective & Composition: Identify the camera angle (e.g., low angle, eye-level, centered symmetrical), framing, and depth of field.
  - Lighting & Mood: Describe the lighting setup (e.g., cinematic side lighting, volumetric light, studio softbox, dramatic low key), shadow quality (soft, diffused), highlights, and the overall mood.
  - Color Palette: Note the dominant colors and any significant accent colors.

  Structure the final prompt:
  1. Prepend with quality modifiers: "Masterpiece, hyperdetailed, 8k, editorial photography, highly polished,".
  2. Weave the analyzed details into a cohesive and compelling description.
  
  Generate the final prompt now.`;
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            temperature: 0.7,
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Failed to generate prompt from image. Please check your API key and try again.");
  }
};
