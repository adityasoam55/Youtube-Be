import multer from "multer";
import path from "path";
import fs from "fs";

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

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
