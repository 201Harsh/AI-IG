const ai = require("../config/AiResponse");

module.exports.imageGen = async (req, res) => {
  const prompt = req.body.prompt;
  try {
    await ai(prompt);
    res.status(200).send("Image generated successfully");
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Error generating image");
  }
};