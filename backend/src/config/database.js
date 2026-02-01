import mongoose from "mongoose";
import logger from "./logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to database");
  } catch (error) {
    error.message = `Failed to connect to database: ${error.message}`;
    logger.error(error);
    process.exit(1);
  }
}
