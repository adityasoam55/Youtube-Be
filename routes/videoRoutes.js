const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const videoController = require("../controllers/videoController");

// ==== UPLOAD (ONLY URL, NOT FILE) ====
router.post("/upload", auth, videoController.uploadVideo);

// ==== LIKE / VIEW / DISLIKE ====
router.put("/:id/view", videoController.addView);
router.put("/:id/like", auth, videoController.toggleLike);
router.put("/:id/dislike", auth, videoController.toggleDislike);

// ==== GET VIDEOS ====
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideoById);

// ==== GET SUGGESTED VIDEOS ====
router.get(
  "/suggest/:category/:excludeId",
  videoController.getSuggestedVideos
);


module.exports = router;
