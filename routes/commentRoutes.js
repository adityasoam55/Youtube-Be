import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Add comment
router.post("/:videoId", addComment);

// Update comment
router.put("/:videoId/comment/:commentId", auth, editComment);

// Delete comment
router.delete("/:videoId/comment/:commentId", auth, deleteComment);

export default router;
