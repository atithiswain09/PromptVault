const mongoose = require("mongoose");
const { ENV } = require("../configs/env");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;
const MONGODB_URI = ENV.MONGODB_URI || "mongodb://localhost:27017/promptvault";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not provided in environment variables.");
  process.exit(1); // Fail-fast to avoid unpredictable state
}

async function connectDB(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error(
      `MongoDB connection failed [${
        MAX_RETRIES - retries + 1
      } attempt(s) left]: ${error.message}`
    );

    if (retries <= 1) {
      console.error("Exhausted all retries. Exiting process.");
      process.exit(1); // Critical failure
    }

    console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(() => connectDB(retries - 1), RETRY_DELAY_MS);
  }
}

export default connectDB;
