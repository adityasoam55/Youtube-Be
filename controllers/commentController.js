const Video = require("../models/Video.model");
const { v4: uuidv4 } = require("uuid");

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId, username, avatar, text } = req.body;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    const newComment = {
      commentId: uuidv4(),
      userId,
      username,
      avatar,
      text,
      timestamp: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EDIT COMMENT
exports.editComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.find((c) => c.commentId === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    comment.text = text;

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const userId = req.user.userId;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.find((c) => c.commentId === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    video.comments = video.comments.filter((c) => c.commentId !== commentId);

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
