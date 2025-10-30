const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

// Route upload avatar
router.post("/avatar", uploadController.uploadAvatar);
const multer = require("multer");
const { uploadAvatar } = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

// ⚙️ Dùng multer lưu file vào RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route upload avatar
router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);

module.exports = router;
