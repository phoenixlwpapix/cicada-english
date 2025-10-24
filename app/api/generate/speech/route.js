import { GoogleGenAI } from "@google/genai";

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateSpeech(text) {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            {
              text: `Say in a gentle, friendly, and expressive storyteller voice: ${text}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });
    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received from API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error(
      "I seem to have lost my voice! Could you read this page for me?"
    );
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json(
        { error: "Text is required for speech generation" },
        { status: 400 }
      );
    }

    const base64Audio = await generateSpeech(text);

    return Response.json({ audio: base64Audio });
  } catch (error) {
    console.error("Speech generation error:", error);
    return Response.json(
      { error: error.message || "Failed to generate speech" },
      { status: 500 }
    );
  }
}
