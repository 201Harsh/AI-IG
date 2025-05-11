const mongoose = require("mongoose");

const ConnectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected....");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};

module.exports = ConnectDB;
