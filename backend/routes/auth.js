const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã được sử dụng' });

    const newUser = new User({ username, email, password, avatar: avatar || '' });
    await newUser.save();

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Không tìm thấy người dùng' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});
// Logout
router.post("/logout", (req, res) => {
  try {
    // Thường token sẽ bị xóa ở client (localStorage)
    // Nếu muốn bạn có thể xóa token server-side nếu dùng blacklist
    res.json({ message: "Đăng xuất thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đăng xuất" });
  }
});

module.exports = router;
