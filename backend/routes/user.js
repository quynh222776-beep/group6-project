const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/* =============================
   1️⃣ Admin xem tất cả người dùng
============================= */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   2️⃣ User xem thông tin cá nhân
============================= */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   3️⃣ User cập nhật thông tin cá nhân
============================= */
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (name) user.name = name;
    if (password) {
      const bcrypt = require("bcrypt");
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   4️⃣ Admin xóa người dùng
============================= */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
