const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
  },
  credit: {
    type: Number,
    default: 10,
  },
});

UserSchema.methods.JWT_Generate = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

UserSchema.methods.ComparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
