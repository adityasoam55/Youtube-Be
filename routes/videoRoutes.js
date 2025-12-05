import express from "express";
import auth from "../middleware/authMiddleware.js";
import * as videoController from "../controllers/videoController.js";

const router = express.Router();

// ==== UPLOAD (ONLY URL, NOT FILE) ====
router.post("/upload", auth, videoController.uploadVideo);

// ==== CHANNEL OPERATIONS (CRUD for channel owner) ====
router.get("/channel/my-videos", auth, videoController.getChannelVideos);
router.put("/channel/:videoId", auth, videoController.updateVideo);
router.delete("/channel/:videoId", auth, videoController.deleteVideo);

// ==== LIKE / VIEW / DISLIKE ====
router.put("/:id/view", videoController.addView);
router.put("/:id/like", auth, videoController.toggleLike);
router.put("/:id/dislike", auth, videoController.toggleDislike);

// ==== GET VIDEOS ====
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideoById);

// ==== GET SUGGESTED VIDEOS ====
router.get("/suggest/:category/:excludeId", videoController.getSuggestedVideos);

export default router;
