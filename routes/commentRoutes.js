import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

/**
 * ============================================================
 * COMMENT ROUTES
 * Handles creating, editing, and deleting comments on videos.
 * ============================================================
 */

/**
 * @route   POST /api/comments/:videoId
 * @desc    Add a new comment to a specific video
 * @access  Login Required (userId + username + avatar come from frontend)
 */
router.post("/:videoId", addComment);

/**
 * @route   PUT /api/comments/:videoId/comment/:commentId
 * @desc    Edit an existing comment (only by the comment owner)
 * @access  Private (JWT required)
 */
router.put("/:videoId/comment/:commentId", auth, editComment);

/**
 * @route   DELETE /api/comments/:videoId/comment/:commentId
 * @desc    Delete a comment (only by the comment owner)
 * @access  Private (JWT required)
 */
router.delete("/:videoId/comment/:commentId", auth, deleteComment);

export default router;
