import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

// Route files
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

/**
 * ============================================================
 * Load Environment Variables
 * ============================================================
 * Loads .env configuration before anything else.
 */
dotenv.config();

/**
 * ============================================================
 * Connect to MongoDB
 * ============================================================
 */
connectDB();

const app = express();

/**
 * ============================================================
 * Global Middlewares
 * ============================================================
 */

// Enable CORS for frontend communication
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

/**
 * ============================================================
 * API Routes
 * ============================================================
 */

// Authentication Routes (Register, Login)
app.use("/api/auth", authRoutes);

// Video Management Routes (upload, like, watch, channel CRUD)
app.use("/api/videos", videoRoutes);

// Comment Routes (add, edit, delete)
app.use("/api/comments", commentRoutes);

// User Routes (profile update, avatar, banner)
app.use("/api/users", userRoutes);

/**
 * ============================================================
 * Root Endpoint
 * ============================================================
 * A basic route to test if the server is running.
 */
app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running...");
});

/**
 * ============================================================
 * Start the Server
 * ============================================================
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
