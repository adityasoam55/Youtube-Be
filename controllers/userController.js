const User = require("../models/User.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json(user);
};

// UPDATE USER DETAILS
exports.updateUser = async (req, res) => {
  const updates = req.body;

  const user = await User.findOneAndUpdate(
    { userId: req.user.userId },
    updates,
    { new: true }
  );

  res.json(user);
};

// UPDATE AVATAR
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "youtube_clone/avatars",
      resource_type: "image",
    });

    fs.unlinkSync(req.file.path); // Delete local file

    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { avatar: uploadResult.secure_url },
      { new: true }
    );

    res.json({ message: "Avatar updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Avatar update failed" });
  }
};
