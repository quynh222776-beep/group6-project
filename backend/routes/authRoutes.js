const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");


// 🧑‍💻 Đăng ký
router.post("/signup", authController.signup);

// 🔐 Đăng nhập (tạo Access & Refresh Token)
router.post("/login", authController.login);

// 🔄 Làm mới Access Token (Refresh Token)
router.post("/refresh", authController.refreshToken);

// 🚪 Đăng xuất (xoá Refresh Token khỏi DB)
router.post("/logout", authController.logout);

// 🔑 Quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// 🔁 Đặt lại mật khẩu
router.post("/reset-password", authController.resetPassword);

// 👤 Lấy thông tin người dùng hiện tại (yêu cầu có token)
router.get("/me", verifyToken, authController.getMe);


module.exports = router;
