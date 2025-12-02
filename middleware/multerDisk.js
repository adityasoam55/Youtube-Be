const multer = require("multer");
const path = require("path");

// TEMP upload folder (for avatar images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp_uploads/");
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
