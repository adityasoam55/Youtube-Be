import express from "express";
import auth from "../middleware/authMiddleware.js";
import * as videoController from "../controllers/videoController.js";

const router = express.Router();

/**
 * ============================================================
 * VIDEO ROUTES
 * Handles uploading, fetching, updating, deleting, liking,
 * disliking, viewing, and video suggestions.
 * ============================================================
 */

/**
 * @route   POST /api/videos/upload
 * @desc    Upload a video by providing a YouTube or MP4 URL
 * @access  Private (JWT required)
 */
router.post("/upload", auth, videoController.uploadVideo);

/* ------------------------------------------------------------
 * CHANNEL OWNER OPERATIONS (CRUD)
 * Only the authenticated channel owner can manage their videos
 * ------------------------------------------------------------ */

/**
 * @route   GET /api/videos/channel/my-videos
 * @desc    Fetch all videos uploaded by the logged-in user
 * @access  Private (JWT required)
 */
router.get("/channel/my-videos", auth, videoController.getChannelVideos);

/**
 * @route   PUT /api/videos/channel/:videoId
 * @desc    Update title, description, or category of a video
 * @access  Private (Owner only)
 */
router.put("/channel/:videoId", auth, videoController.updateVideo);

/**
 * @route   DELETE /api/videos/channel/:videoId
 * @desc    Delete one of the user's uploaded videos
 * @access  Private (Owner only)
 */
router.delete("/channel/:videoId", auth, videoController.deleteVideo);

/* ------------------------------------------------------------
 * VIDEO INTERACTIONS – LIKE, DISLIKE, VIEW COUNTS
 * ------------------------------------------------------------ */

/**
 * @route   PUT /api/videos/:id/view
 * @desc    Increment view count for a video
 * @access  Public
 */
router.put("/:id/view", videoController.addView);

/**
 * @route   PUT /api/videos/:id/like
 * @desc    Toggle like for a video
 * @access  Private (JWT required)
 */
router.put("/:id/like", auth, videoController.toggleLike);

/**
 * @route   PUT /api/videos/:id/dislike
 * @desc    Toggle dislike for a video
 * @access  Private (JWT required)
 */
router.put("/:id/dislike", auth, videoController.toggleDislike);

/* ------------------------------------------------------------
 * FETCH VIDEOS
 * ------------------------------------------------------------ */

/**
 * @route   GET /api/videos
 * @desc    Get all videos sorted by upload date
 * @access  Public
 */
router.get("/", videoController.getVideos);

/**
 * @route   GET /api/videos/:id
 * @desc    Get single video by videoId
 * @access  Public
 */
router.get("/:id", videoController.getVideoById);

/* ------------------------------------------------------------
 * SUGGESTED VIDEOS
 * ------------------------------------------------------------ */

/**
 * @route   GET /api/videos/suggest/:category/:excludeId
 * @desc    Fetch related videos in same category excluding current video
 * @access  Public
 */
router.get("/suggest/:category/:excludeId", videoController.getSuggestedVideos);

export default router;
