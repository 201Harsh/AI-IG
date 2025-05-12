const userModel = require("../models/user.model");
const ai = require("../config/AiResponse");


module.exports.imageGen = async (req, res) => {
  const { prompt, style, orientation } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.credit <= 0) {
      return res.status(403).json({ error: "Insufficient credits" });
    }

    const result = await ai(prompt, style, orientation);

    if (!result) {
      return res.status(500).json({ error: "Error generating image" });
    }

    user.credit -= 1; // ✅ use "credit" now
    await user.save();

    res.status(200).json({
      ...result,
      creditLeft: user.credit, // ✅ send updated credit to frontend
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
