const multer = require("multer");

// store file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // up to 1GB (adjust if needed)
});

module.exports = upload;
