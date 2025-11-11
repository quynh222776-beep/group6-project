// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ---------------------------------------------
// GET /users/me → lấy thông tin user hiện tại
// ---------------------------------------------
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // req.user được verifyToken gắn
    const user = await User.findById(userId).select("-password"); // bỏ password
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------------------------------
// GET /users → admin lấy toàn bộ user
// ---------------------------------------------
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // bỏ password
    res.json(users); // trả về mảng users
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------------------------------
// POST /users → admin tạo user mới
// ---------------------------------------------
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
