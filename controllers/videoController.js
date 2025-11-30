const Video = require("../models/Video.model");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// helper: upload buffer to Cloudinary via upload_stream
function uploadBufferToCloudinary(buffer, publicIdBase, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// POST /api/videos/upload
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const { title, description, category, channelId, uploader } = req.body;

    const videoPublicId = `youtube_clone/videos/${Date.now()}_${Math.round(
      Math.random() * 1e6
    )}`;

    // upload video to cloudinary (resource_type: 'video')
    const uploadResult = await uploadBufferToCloudinary(
      req.file.buffer,
      videoPublicId,
      {
        resource_type: "video",
        public_id: videoPublicId,
        // generate an image thumbnail eagerly
        eager: [{ width: 720, height: 405, crop: "fill", format: "jpg" }],
        eager_async: false,
      }
    );

    // uploadResult.secure_url -> video URL
    // uploadResult.eager[0].secure_url -> thumbnail (if eager worked)
    const videoUrl = uploadResult.secure_url;
    const thumbnailUrl =
      (uploadResult.eager &&
        uploadResult.eager[0] &&
        uploadResult.eager[0].secure_url) ||
      "";

    const newVideo = new Video({
      videoId: uuidv4(),
      title,
      description,
      category,
      channelId,
      uploader,
      videoUrl,
      thumbnailUrl,
    });

    await newVideo.save();

    res.status(201).json({ message: "Uploaded", video: newVideo });
  } catch (err) {
    console.error("uploadVideo error", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/:id
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.id });
    if (!video) return res.status(404).json({ message: "Not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
