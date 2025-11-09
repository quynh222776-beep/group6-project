// ==============================
// 📁 routes/uploadRoutes.js
// ==============================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../controllers/uploadController");

// ⚙️ Cấu hình Multer để đọc file
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route upload ảnh đại diện
router.post("/upload-avatar", verifyToken, upload.single("file"), uploadAvatar);

module.exports = router;
