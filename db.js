import mongoose from "mongoose";

/**
 * ============================================================
 * MongoDB Connection Utility
 * Establishes a connection to MongoDB using Mongoose.
 * This function is imported and executed in server.js
 * ============================================================
 */

const connectDB = async () => {
  try {
    /**
     * Mongoose automatically handles:
     * - connection pooling
     * - reconnection attempts
     * - parsing connection string
     */
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    /**
     * If connection fails, log only the message
     * to avoid exposing sensitive error details.
     */
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

export default connectDB;
