import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * =======================================================
 * GET LOGGED-IN USER
 * =======================================================
 * Retrieves the authenticated user's profile using the
 * decoded token data (req.user.userId injected by middleware).
 */
export const getMe = async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json(user);
};

/**
 * =======================================================
 * UPDATE USER DETAILS
 * =======================================================
 * Only updates allowed fields:
 * - username
 * - email
 * - channelDescription (NEW)
 *
 * Uses $set operator to update only provided fields.
 */
export const updateUser = async (req, res) => {
  try {
    const updates = {};

    // Update username if provided
    if (req.body.username !== undefined) {
      updates.username = req.body.username;
    }

    // Update email if provided
    if (req.body.email !== undefined) {
      updates.email = req.body.email;
    }

    // NEW: Update channel description
    if (req.body.channelDescription !== undefined) {
      updates.channelDescription = req.body.channelDescription;
    }

    // Apply updates and return updated user document
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

/**
 * =======================================================
 * UPDATE BANNER IMAGE
 * =======================================================
 * 1. Receives uploaded file from Multer
 * 2. Uploads to Cloudinary → youtube_banner folder
 * 3. Updates user's banner field in database
 */
export const updateBanner = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "youtube_banner",
    });

    // Update user document with new banner URL
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

/**
 * =======================================================
 * UPDATE AVATAR (PROFILE PHOTO)
 * =======================================================
 * 1. Validates file exists
 * 2. Uploads avatar image to Cloudinary
 * 3. Deletes temporary local file
 * 4. Updates user's avatar field
 */
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Ensure Cloudinary config is present
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({
        message: "Server misconfigured: Cloudinary credentials missing",
      });
    }

    let uploadResult;

    // Upload avatar to Cloudinary
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

    // Delete temporary file from server
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Update avatar URL in database
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
