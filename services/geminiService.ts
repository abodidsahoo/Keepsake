import { GoogleGenAI, Modality } from "@google/genai";

const BASE_PROMPT = `
Your primary goal is to restore an old, faded photograph. Pay special attention to facial features: they must be preserved with the highest fidelity. Only refine colors and remove imperfections like scratches and chemical stains from faces, do not alter the underlying structure or identity.

For the rest of the image:
- Meticulously remove all scratches, chemical stains, and edge damage.
- Enhance the image to evoke a joyful and serene nostalgia, without being overly dramatic or HDR. Apply a soft, pastel color palette.
- Sharpen the focus subtly to bring out details while maintaining a natural, non-digital look.
- Introduce fine, natural film grain, akin to a Mamiya medium format film camera, to enhance print quality and contribute to the nostalgic aesthetic.
- Preserve the original color balance and overall mood as much as possible, just revitalized and cleaned.
- If possible, intelligently extend the background to create a more complete and fuller composition, but only if it looks natural.
- The final output should look like it was captured with a modern DSLR camera, yet retain its nostalgic soul.
`;

export const restoreImage = async (
  ai: GoogleGenAI,
  base64ImageData: string,
  mimeType: string,
  additionalPrompt: string
): Promise<string> => {
  const finalPrompt = `${BASE_PROMPT}${additionalPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      const restoredBase64 = firstPart.inlineData.data;
      return `data:${firstPart.inlineData.mimeType};base64,${restoredBase64}`;
    } else {
      throw new Error("Invalid response format from Gemini API. No image data received.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};