const express = require("express");
const auth = require('../middleware/authMiddleware')
const router = express.Router();
const {
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

// Add comment
router.post("/:videoId", addComment);

// Update comment
router.put("/:videoId/comment/:commentId", auth, editComment);

// delete comment
router.delete("/:videoId/comment/:commentId", auth, deleteComment);


module.exports = router;
