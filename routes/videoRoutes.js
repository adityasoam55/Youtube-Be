const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const videoController = require("../controllers/videoController");

// PUT routes FIRST
router.put("/:id/view", videoController.addView);
router.put("/:id/like", auth, videoController.toggleLike);
router.put("/:id/dislike", auth, videoController.toggleDislike);

// GET routes AFTER
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideoById);

module.exports = router;
