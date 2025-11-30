const express = require("express");
const router = express.Router();
const {
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

// Add comment
router.post("/:videoId", addComment);

// Edit comment
router.put("/:videoId/:commentId", editComment);

// Delete comment
router.delete("/:videoId/:commentId", deleteComment);

module.exports = router;
