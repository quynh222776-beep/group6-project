// ==========================
// 📁 FILE: routes/authRoutes.js
// ==========================

// 🌍 Import modules
const express = require("express");
const router = express.Router();

// 🧠 Import controller
const authController = require("../controllers/authController");


// ==========================
// 🔐 AUTH ROUTES
// ==========================

// 📝 Đăng ký tài khoản mới
// POST /api/auth/signup
router.post("/signup", authController.registerUser);

// 🔑 Đăng nhập
// POST /api/auth/login
router.post("/login", authController.login);

// ❓ Quên mật khẩu (gửi email khôi phục)
// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// ♻️ Đặt lại mật khẩu mới
// POST /api/auth/reset-password
router.post("/reset-password", authController.resetPassword);

// ==========================
// 📤 Export router
// ==========================
module.exports = router;
