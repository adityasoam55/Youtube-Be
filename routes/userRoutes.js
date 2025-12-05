import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/multerDisk.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

/**
 * ============================================================
 * USER ROUTES
 * Handles profile fetching, updating, avatar upload, and banner upload.
 * ============================================================
 */

/**
 * @route   GET /api/users/me
 * @desc    Fetch authenticated user's profile
 * @access  Private (JWT required)
 */
router.get("/me", auth, userController.getMe);

/**
 * @route   PUT /api/users/update
 * @desc    Update username, email, or channel description
 * @access  Private (JWT required)
 */
router.put("/update", auth, userController.updateUser);

/**
 * @route   PUT /api/users/banner
 * @desc    Upload or update user channel banner image
 * @access  Private (JWT required)
 * @upload  Expects `banner` field (image file)
 */
router.put(
  "/banner",
  auth,
  upload.single("banner"),
  userController.updateBanner
);

/**
 * @route   PUT /api/users/avatar
 * @desc    Upload or update user profile avatar
 * @access  Private (JWT required)
 * @upload  Expects `avatar` field (image file)
 */
router.put(
  "/avatar",
  auth,
  upload.single("avatar"),
  userController.updateAvatar
);

export default router;
