import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Video Routes
app.use("/api/videos", videoRoutes);

// Comment Routes
app.use("/api/comments", commentRoutes);

// User/Profile Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
