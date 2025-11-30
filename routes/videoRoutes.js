const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMemory");
const videoController = require("../controllers/videoController");
const auth = require("../middleware/auth"); // <-- add this

// Upload (PROTECTED) — logged-in users only
router.post(
  "/upload",
  auth, // <--- protect route
  upload.single("video"),
  videoController.uploadVideo
);

// Public: get all videos
router.get("/", videoController.getVideos);

// Public: get single video
router.get("/:id", videoController.getVideoById);

module.exports = router;
