const ai = require("../config/AiResponse");


module.exports.imageGen = async (req, res) => {
  const { prompt, style, orientation } = req.body;

  try {

    const result = await ai(prompt, style, orientation);

    if (!result) {
      return res.status(500).json({ error: "Error generating image" });
    }

    res.status(200).json(result);

  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Server Failed..." });
  }
};
