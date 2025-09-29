import { GoogleGenAI } from "@google/genai";

// Initialize Google AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { imagePrompt } = await request.json();

    if (!imagePrompt) {
      return Response.json(
        { error: "No imagePrompt provided" },
        { status: 400 }
      );
    }

    console.log("[Image API] Using provided ImagePrompt:", imagePrompt);

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png",
        aspectRatio: "4:3",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return Response.json({
        success: true,
        imageData: response.generatedImages[0].image.imageBytes,
        mimeType: "image/png",
      });
    }

    throw new Error(
      "No image was generated. The model may have refused the request due to safety policies."
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return Response.json(
      { error: "Failed to generate image", details: error.message },
      { status: 500 }
    );
  }
}
