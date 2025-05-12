const ai = require("../config/AiResponse");

module.exports.imageGen = async (req, res) => {
  const { prompt, style , orientation } = req.body;

  try {
    const result = await ai(prompt, style , orientation); // returns { image, text }
    res.status(200).json(result); // Send result to frontend
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
};
