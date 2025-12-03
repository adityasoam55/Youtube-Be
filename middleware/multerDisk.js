const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure temp_uploads directory exists
const tempDir = "temp_uploads/";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// TEMP upload folder (for avatar images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

module.exports = multer({ storage, fileFilter });
