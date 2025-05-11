const userModel = require("../models/user.model");
const userServices = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.RegisterUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;

  try {
    const IsUserExist = await userModel.findOne({ username });
    if (IsUserExist) {
      return res.status(422).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const newUser = await userServices.CreteUser({
      username,
      email,
      password: hashedPassword,
    });
    const token = await newUser.JWT_Generate();

    res.status(200).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.LoginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    const IsMatchedPassword = await user.ComparePassword(password);

    if (!IsMatchedPassword) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    const token = await user.JWT_Generate();
    
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
