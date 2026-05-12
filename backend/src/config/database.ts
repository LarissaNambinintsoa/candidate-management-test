import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    
    logger.info("MongoDB Memory Server connected successfully");
    console.log("✅ MongoDB Memory Server is running");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    console.error("❌ Failed to connect to MongoDB");
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
