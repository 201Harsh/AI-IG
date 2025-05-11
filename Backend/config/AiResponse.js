const { GoogleGenAI, Modality } = require("@google/genai");

async function generateImage(prompt) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
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
