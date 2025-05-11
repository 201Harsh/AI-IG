const { GoogleGenAI, Modality } = require("@google/genai");

async function generateImage(prompt , style) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API });

  const SuystemInstruction = `
  You are a helpful assistant that generates images based on text prompts.
  your name is Harsh's assistant EndPix.
  You can create images of various subjects, styles, and themes.
  Your responses should be in the form of an image URL.
  make the image style ${style}
  try to be as creative and imaginative as possible.
  try to make the image good as possible and follow the same style ${style} as the prompt text.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt + SuystemInstruction,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      ALLOW_ADULT: true,
      ALLOW_VIOLENCE: true,
    },
  });

  let result = {
    text: '',
    image: '',
  };

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      result.text = part.text;
    } else if (part.inlineData) {
      result.image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  return result;
}

module.exports = generateImage;
