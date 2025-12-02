const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multerDisk"); // for image
const userController = require("../controllers/userController");

router.get("/me", auth, userController.getMe);
router.put("/update", auth, userController.updateUser);
router.put(
  "/avatar",
  auth,
  upload.single("avatar"),
  userController.updateAvatar
);

module.exports = router;
