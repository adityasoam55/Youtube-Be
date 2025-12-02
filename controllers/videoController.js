// backend/src/controllers/videoController.js
const Video = require("../models/Video.model");
const { v4: uuidv4 } = require("uuid");

/**
 * Helper: normalize YouTube links to embed URL and generate thumbnail
 * Accepts:
 *  - https://www.youtube.com/watch?v=VIDEOID
 *  - https://youtu.be/VIDEOID
 *  - https://www.youtube.com/embed/VIDEOID
 *  - direct mp4 links -> returned unchanged
 */
function normalizeVideoLink(url) {
  if (!url) return { videoUrl: "", thumbnailUrl: "" };

  // Trim
  const trimmed = url.trim();

  // YouTube watch URL
  const ytWatch = trimmed.match(/[?&]v=([^&]+)/);
  if (ytWatch && ytWatch[1]) {
    const id = ytWatch[1];
    return {
      videoUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // youtu.be short link
  const ytShort = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (ytShort && ytShort[1]) {
    const id = ytShort[1];
    return {
      videoUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // embed link already
  const ytEmbed = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (ytEmbed && ytEmbed[1]) {
    const id = ytEmbed[1];
    return {
      videoUrl: trimmed,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // If link looks like mp4 or other direct video host, keep it and no thumbnail
  // Basic heuristic:
  if (/\.(mp4|webm|ogg|mov|mkv)$/i.test(trimmed)) {
    return { videoUrl: trimmed, thumbnailUrl: "" };
  }

  // Fallback: return as-is (app will try to iframe if compatible)
  return { videoUrl: trimmed, thumbnailUrl: "" };
}

// Upload video by saving only link
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl } = req.body;
    const user = req.user;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL required" });
    }

    // Extract YouTube ID for all formats (watch?v=, youtu.be, embed)
    const extractYouTubeId = (url) => {
      let match;

      // watch?v=
      match = url.match(/[?&]v=([^&]+)/);
      if (match) return match[1];

      // youtu.be/
      match = url.match(/youtu\.be\/([^?]+)/);
      if (match) return match[1];

      // embed/
      match = url.match(/embed\/([^?]+)/);
      if (match) return match[1];

      return null;
    };

    const youtubeId = extractYouTubeId(videoUrl);

    let thumbnailUrl = "";
    if (youtubeId) {
      // generate HD YouTube thumbnail
      thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
    }

    const newVideo = new Video({
      videoId: uuidv4(),
      title,
      description,
      category,
      uploader: user.username,
      channelId: user.userId,
      videoUrl,
      thumbnailUrl,
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error("Upload error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL and GET BY ID
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.id });
    if (!video) return res.status(404).json({ message: "Not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addView = async (req, res) => {
  try {
    // console.log("📌 VIEW ROUTE HIT");
    // console.log("ID received from frontend:", req.params.id);

    const updatedVideo = await Video.findOneAndUpdate(
      { videoId: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );

    // console.log("📌 UPDATED VIDEO:", updatedVideo);

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updatedVideo);
  } catch (err) {
    console.error("❌ Error in addView:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove user from dislikes if present
    video.dislikes = video.dislikes.filter((id) => id !== userId);

    if (video.likes.includes(userId)) {
      // Unlike
      video.likes = video.likes.filter((id) => id !== userId);
    } else {
      // Like
      video.likes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleDislike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove user from likes if present
    video.likes = video.likes.filter((id) => id !== userId);

    if (video.dislikes.includes(userId)) {
      // Remove dislike
      video.dislikes = video.dislikes.filter((id) => id !== userId);
    } else {
      // Add dislike
      video.dislikes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
