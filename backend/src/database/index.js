const mongoose = require("mongoose");
const ENV = require("../configs/env");

const MONGODB_URI = ENV.MONGODB_URI || "mongodb://localhost:27017/promptvault";

// creates connection between Backend and Database
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
