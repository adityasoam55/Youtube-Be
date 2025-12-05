import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * ============================================================
 * MULTER DISK STORAGE CONFIGURATION
 * Used for temporarily storing uploaded images (avatar/banner)
 * before uploading them to Cloudinary.
 *
 * - Ensures temp directory exists
 * - Filters non-image uploads
 * - Generates unique filenames
 * - Limits file size to 10MB
 * ============================================================
 */

// Temporary storage folder
const tempDir = "temp_uploads/";

// Create folder if missing
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * ------------------------------------------------------------
 * Storage Engine
 * Defines where and how uploaded files will be stored.
 * ------------------------------------------------------------
 */
const storage = multer.diskStorage({
  // Save files inside temp_uploads/
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },

  // Assign unique filename: timestamp + random number + extension
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/**
 * ------------------------------------------------------------
 * File Filter
 * Only allow image file types (PNG, JPG, JPEG, WEBP, etc.)
 * ------------------------------------------------------------
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/**
 * ------------------------------------------------------------
 * Multer Export
 * Includes:
 *  - disk storage
 *  - image-only filter
 *  - max file size: 10 MB
 * ------------------------------------------------------------
 */
export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
