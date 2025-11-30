const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  channelId: String,
  uploader: String,
  views: Number,
  likes: [String], // userIds
  dislikes: [String],
  uploadDate: String,
  category: String,

  // NEW:
  comments: [CommentSchema],
});

module.exports = mongoose.model("Video", VideoSchema);
