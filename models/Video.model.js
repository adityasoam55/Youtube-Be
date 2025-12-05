import mongoose from "mongoose";

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
  title: { type: String, required: true },
  description: String,
  category: String,
  channelId: String,
  uploader: String,
  uploaderName: String,
  uploaderAvatar: String,

  // Now a URL to an external video (YouTube embed URL or MP4 public link)
  videoUrl: { type: String, required: true },
  // Optional thumbnail (YouTube thumbnail or other host)
  thumbnailUrl: { type: String, default: "" },

  views: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },

  uploadDate: { type: Date, default: Date.now },

  comments: [CommentSchema],
});

export default mongoose.model("Video", VideoSchema);
