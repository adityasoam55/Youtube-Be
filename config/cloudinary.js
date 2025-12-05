/**
 * ============================================================
 * Cloudinary Configuration
 * ============================================================
 * This file initializes the Cloudinary SDK using credentials
 * from environment variables and exports the configured instance.
 * Used for uploading avatars, banners, and other images.
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Configure Cloudinary with credentials stored in .env
 * secure: true ensures HTTPS URLs for all uploaded images.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Cloudinary account name
  api_key: process.env.CLOUDINARY_API_KEY,         // Public API key
  api_secret: process.env.CLOUDINARY_API_SECRET,   // Secret API key
  secure: true,                                    // Serve only over HTTPS
});

// Export configured instance
export default cloudinary;
