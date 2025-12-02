const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Video Routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

// Comment Routes
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);


// User/Profile Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
