import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// GET LOGGED-IN USER
export const getMe = async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json(user);
};

// UPDATE USER DETAILS
export const updateUser = async (req, res) => {
  try {
    const updates = {};

    // Only update fields that actually exist in schema
    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.email !== undefined) updates.email = req.body.email;

    // NEW: Channel Description
    if (req.body.channelDescription !== undefined) {
      updates.channelDescription = req.body.channelDescription;
    }

    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Upload Banner
export const updateBanner = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "youtube_banner",
    });

    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { banner: result.secure_url },
      { new: true }
    );

    res.json({ message: "Banner updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE AVATAR
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Check if Cloudinary credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({
        message: "Server misconfigured: Cloudinary credentials missing",
      });
    }

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube_clone/avatars",
        resource_type: "image",
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError.message);
      return res
        .status(500)
        .json({ message: "Failed to upload image to cloud service" });
    }

    // Clean up local file if it exists
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { avatar: uploadResult.secure_url },
      { new: true }
    );

    res.json({ message: "Avatar updated", user });
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Avatar update failed: " + err.message });
  }
};
