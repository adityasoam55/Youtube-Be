import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/multerDisk.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, userController.getMe);
router.put("/update", auth, userController.updateUser);
router.put(
  "/banner",
  auth,
  upload.single("banner"),
  userController.updateBanner
);
router.put(
  "/avatar",
  auth,
  upload.single("avatar"),
  userController.updateAvatar
);

export default router;
