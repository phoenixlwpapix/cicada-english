/**
 * Generate portrait image using Google AI
 * @param {string} prompt - The image generation prompt
 * @returns {Promise<string>} Base64 encoded image data
 */
export async function generatePortrait(prompt) {
  try {
    const response = await fetch("/api/generate/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imagePrompt: prompt,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to generate image");
    }

    if (result.success && result.imageData) {
      return result.imageData;
    }

    throw new Error(
      "No image was generated. The model may have refused the request due to safety policies."
    );
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
}

/**
 * Convert base64 image data to blob URL for display
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {string} Blob URL
 */
export function base64ToBlobUrl(base64Data, mimeType) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
