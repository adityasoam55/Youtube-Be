const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentId: String,
  userId: String,
  username: String,
  avatar: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  category: String,
  channelId: String,
  uploader: String,

  // Cloudinary URL for video
  videoUrl: String,
  // Cloudinary eager thumbnail (jpg) URL (optional)
  thumbnailUrl: String,

  views: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },

  uploadDate: { type: Date, default: Date.now },

  comments: [CommentSchema],
});

module.exports = mongoose.model("Video", VideoSchema);
