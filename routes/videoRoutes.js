const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMemory");
const videoController = require("../controllers/videoController");

// Upload (multipart/form-data)
router.post("/upload", upload.single("video"), videoController.uploadVideo);

// List
router.get("/", videoController.getVideos);

// Get single
router.get("/:id", videoController.getVideoById);

module.exports = router;
