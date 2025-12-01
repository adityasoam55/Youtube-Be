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

exports.saveVideo = async (req, res) => {
  try {
    const { title, description, category, channelId, uploader, videoUrl } =
      req.body;

    if (!videoUrl || !title) {
      return res
        .status(400)
        .json({ message: "title and videoUrl are required" });
    }

    // Normalize video link (youtube -> embed + thumbnail)
    const normalized = normalizeVideoLink(videoUrl);

    const newVideo = new Video({
      videoId: uuidv4(),
      title,
      description,
      category,
      channelId,
      uploader,
      videoUrl: normalized.videoUrl,
      thumbnailUrl: normalized.thumbnailUrl,
    });

    await newVideo.save();

    return res.status(201).json({ message: "Video saved", video: newVideo });
  } catch (err) {
    console.error("saveVideo error", err);
    return res.status(500).json({ message: err.message || "Server error" });
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
