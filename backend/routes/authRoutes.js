// ==========================
// 📁 FILE: routes/authRoutes.js
// ==========================

// 🌍 Import modules
const express = require("express");

// 📂 Import controllers
const authController = require("../controllers/authController");
// 📂 Import middleware
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();




// ==========================
// 📝 Routes
// ==========================

// Route đăng ký tài khoản
router.post("/signup", authController.signup);

// Route đăng nhập
router.post("/login", authController.login);

// Route quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// Route đặt lại mật khẩu
router.post("/reset-password/:token", authController.resetPassword);

// Route upload avatar (cần authMiddleware để xác thực người dùng)
router.post("/upload-avatar", authMiddleware, authController.uploadAvatar);

module.exports = router;
