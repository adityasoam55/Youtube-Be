// backend/src/routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const auth = require("../middleware/authMiddleware"); 

// Upload (PROTECTED): save metadata (frontend provides videoUrl)
router.post("/upload", auth, videoController.saveVideo);

// List
router.get("/", videoController.getVideos);

// Get single
router.get("/:id", videoController.getVideoById);

module.exports = router;
