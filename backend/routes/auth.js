const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// ================================
// 📝 Register User
// ================================
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Kiểm tra xem các trường thông tin có đầy đủ không
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã được sử dụng' });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({ username, email, password: hashedPassword, avatar: avatar || '' });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Tạo JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Trả về thông tin người dùng và token
    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// ================================
// 🔐 Logout
// ================================
router.post("/logout", (req, res) => {
  try {
    // Token sẽ bị xóa ở client (localStorage hoặc sessionStorage)
    res.json({ message: "Đăng xuất thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đăng xuất" });
  }
});

// ================================
// 🔑 Forgot Password - Gửi token reset
// ================================
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }

  // Giả sử bạn đang tạo một token
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });  // Token có hạn 15 phút
  return res.json({ message: "Token reset mật khẩu đã được tạo", resetToken });
});

// ================================
// 🔑 Reset Password - Đặt lại mật khẩu
// ================================
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Cần cung cấp token và mật khẩu mới" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = decoded.email;

    // Tìm người dùng bằng email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng với email này" });

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới cho người dùng
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
  } catch (err) {
    console.error("❌ Lỗi reset mật khẩu:", err);
    res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu", error: err.message });
  }
});

module.exports = router;
