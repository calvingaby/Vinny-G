import { Part } from "@google/genai";

/**
 * Converts a File object to a GoogleGenAI.Part object.
 * @param file The file to convert.
 * @returns A promise that resolves to the Part object.
 */
export const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the Data URL prefix, which we need to remove.
      // e.g., "data:image/jpeg;base64,...." -> "...."
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};
