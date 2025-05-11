const userModel = require("../models/user.model");

module.exports.CreteUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("Please provide all fields");
  }

  const Newuser = await userModel.create({
    username,
    email,
    password,
  });

  return Newuser;
};