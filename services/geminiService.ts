
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};

export const generateVideoWithVeo = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  aspectRatio: AspectRatio,
  onProgress: (message: string) => void
) => {
  try {
    onProgress("Initializing video generation...");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Image,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio,
      }
    });

    onProgress("Video generation started. This may take a few minutes...");
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
      onProgress("Checking generation status...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if(operation.error) {
      throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    onProgress("Generation complete! Fetching video...");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Could not retrieve video download link.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    onProgress("Video downloaded successfully!");
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Error generating video with Veo:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw new Error("API Key not found or invalid. Please select a valid key.");
    }
    throw error;
  }
};
