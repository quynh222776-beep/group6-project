// ===== IMPORTS =====
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// =============================
// 📦 LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
// =============================
// 👉 Chỉ Admin mới xem được (nếu bạn đang test có thể bỏ middleware verifyToken, isAdmin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email"); // ✅ chỉ lấy 2 trường cần thiết
    res.status(200).json(users); // ✅ Trả về MẢNG users trực tiếp (React .map sẽ hoạt động)
  } catch (error) {
    console.error("🔥 Lỗi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
  }
});

// =============================
// 👤 LẤY THÔNG TIN CÁ NHÂN
// =============================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin cá nhân", error: error.message });
  }
});

// =============================
// ✏️ CẬP NHẬT THÔNG TIN CÁ NHÂN
// =============================
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({
      message: "Cập nhật thành công",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error: error.message });
  }
});

// =============================
// 🗑️ XÓA NGƯỜI DÙNG (Admin)
// =============================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa người dùng", error: error.message });
  }
});

module.exports = router;
