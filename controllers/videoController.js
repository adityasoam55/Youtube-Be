import Video from "../models/Video.model.js";
import User from "../models/User.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * ============================================================
 * Utility: Normalize YouTube links → embed + thumbnail
 * Supports:
 *  - https://youtube.com/watch?v=ID
 *  - https://youtu.be/ID
 *  - https://youtube.com/embed/ID
 *  - Direct .mp4, .webm links
 * ============================================================
 */
function normalizeVideoLink(url) {
  if (!url) return { videoUrl: "", thumbnailUrl: "" };

  const trimmed = url.trim();

  // Format: watch?v=ID
  const ytWatch = trimmed.match(/[?&]v=([^&]+)/);
  if (ytWatch && ytWatch[1]) {
    const id = ytWatch[1];
    return {
      videoUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // Format: youtu.be/ID
  const ytShort = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (ytShort && ytShort[1]) {
    const id = ytShort[1];
    return {
      videoUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // Already embed format
  const ytEmbed = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (ytEmbed && ytEmbed[1]) {
    const id = ytEmbed[1];
    return {
      videoUrl: trimmed,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // Direct video file (mp4, webm, etc.)
  if (/\.(mp4|webm|ogg|mov|mkv)$/i.test(trimmed)) {
    return { videoUrl: trimmed, thumbnailUrl: "" };
  }

  // Unknown format → return raw
  return { videoUrl: trimmed, thumbnailUrl: "" };
}

/**
 * ============================================================
 * UPLOAD VIDEO (URL ONLY)
 * Saves metadata + auto-generates YouTube thumbnail.
 * ============================================================
 */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl } = req.body;
    const user = req.user;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL required" });
    }

    /**
     * Extract YouTube ID from:
     *  - watch?v=ID
     *  - youtu.be/ID
     *  - embed/ID
     */
    const extractYouTubeId = (url) => {
      let match;

      match = url.match(/[?&]v=([^&]+)/); // watch?v=
      if (match) return match[1];

      match = url.match(/youtu\.be\/([^?]+)/); // youtu.be/
      if (match) return match[1];

      match = url.match(/embed\/([^?]+)/); // embed/
      if (match) return match[1];

      return null;
    };

    const youtubeId = extractYouTubeId(videoUrl);
    let thumbnailUrl = youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
      : "";

    // Create new video entry
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

/**
 * ============================================================
 * GET ALL VIDEOS (Newest First)
 * Also attaches channel avatar for each video.
 * ============================================================
 */
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });

    // Collect channelIds to fetch avatars in 1 DB query
    const channelIds = [
      ...new Set(videos.map((v) => v.channelId).filter(Boolean)),
    ];

    const users = await User.find({ userId: { $in: channelIds } });

    // Map userId → avatar
    const avatarMap = {};
    users.forEach((u) => {
      avatarMap[u.userId] = u.avatar || "";
    });

    // Attach avatar to each video
    const videosWithAvatar = videos.map((v) => {
      const obj = v.toObject ? v.toObject() : { ...v };
      obj.uploaderAvatar = avatarMap[v.channelId] || "";
      return obj;
    });

    res.json(videosWithAvatar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * GET SINGLE VIDEO BY ID
 * Also attaches uploader avatar.
 * ============================================================
 */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.id });
    if (!video) return res.status(404).json({ message: "Not found" });

    const user = await User.findOne({ userId: video.channelId });

    const obj = video.toObject ? video.toObject() : { ...video };
    obj.uploaderAvatar = (user && user.avatar) || "";

    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * GET SUGGESTED VIDEOS (Same Category)
 * Excludes the current video.
 * ============================================================
 */
export const getSuggestedVideos = async (req, res) => {
  try {
    const { category, excludeId } = req.params;

    const videos = await Video.find({
      category,
      videoId: { $ne: excludeId },
    })
      .sort({ uploadDate: -1 })
      .limit(8);

    const channelIds = [
      ...new Set(videos.map((v) => v.channelId).filter(Boolean)),
    ];
    const users = await User.find({ userId: { $in: channelIds } });

    const avatarMap = {};
    users.forEach((u) => {
      avatarMap[u.userId] = u.avatar || "";
    });

    const videosWithAvatar = videos.map((v) => {
      const obj = v.toObject ? v.toObject() : { ...v };
      obj.uploaderAvatar = avatarMap[v.channelId] || "";
      return obj;
    });

    res.json(videosWithAvatar);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};

/**
 * ============================================================
 * ADD A VIEW (simple +1 increment)
 * ============================================================
 */
export const addView = async (req, res) => {
  try {
    const updatedVideo = await Video.findOneAndUpdate(
      { videoId: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updatedVideo);
  } catch (err) {
    console.error("❌ Error in addView:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * LIKE A VIDEO
 * Removes dislike if exists.
 * If already liked → undo like.
 * ============================================================
 */
export const toggleLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const videoIdParam = req.params.videoId || req.params.id;

    if (!videoIdParam)
      return res.status(400).json({ message: "Video id missing" });

    const video = await Video.findOne({ videoId: videoIdParam });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from dislikes
    video.dislikes = video.dislikes.filter((id) => id !== userId);

    if (video.likes.includes(userId)) {
      // Unlike
      video.likes = video.likes.filter((id) => id !== userId);
    } else {
      // Add like
      video.likes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * DISLIKE A VIDEO
 * Removes like if exists.
 * If already disliked → undo dislike.
 * ============================================================
 */
export const toggleDislike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const videoIdParam = req.params.videoId || req.params.id;

    if (!videoIdParam)
      return res.status(400).json({ message: "Video id missing" });

    const video = await Video.findOne({ videoId: videoIdParam });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from likes
    video.likes = video.likes.filter((id) => id !== userId);

    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((id) => id !== userId);
    } else {
      video.dislikes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * GET ALL VIDEOS OF LOGGED-IN USER (Channel Page)
 * ============================================================
 */
export const getChannelVideos = async (req, res) => {
  try {
    const userId = req.user.userId;

    const videos = await Video.find({ channelId: userId }).sort({
      uploadDate: -1,
    });

    const user = await User.findOne({ userId });
    const uploaderAvatar = (user && user.avatar) || "";

    const videosWithAvatar = videos.map((v) => {
      const obj = v.toObject ? v.toObject() : { ...v };
      obj.uploaderAvatar = uploaderAvatar;
      return obj;
    });

    res.json(videosWithAvatar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * UPDATE VIDEO (Only Owner)
 * Fields user can modify:
 *  - title
 *  - description
 *  - category
 * ============================================================
 */
export const updateVideo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;
    const { title, description, category } = req.body;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Ownership check
    if (video.channelId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this video" });
    }

    // Update editable fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (category) video.category = category;

    await video.save();
    res.json({ message: "Video updated successfully", video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================================
 * DELETE VIDEO (Only Owner)
 * ============================================================
 */
export const deleteVideo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Ownership check
    if (video.channelId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this video" });
    }

    await Video.deleteOne({ videoId });

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
