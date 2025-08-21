import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/resume_builder';

    if (!process.env.MONGO_URI) {
      console.warn("⚠️  MONGO_URI not found in environment variables, using default local connection");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Connected to: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("💡 Make sure MongoDB is running and MONGO_URI is set correctly");
    process.exit(1);
  }
};
