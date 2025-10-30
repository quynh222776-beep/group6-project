const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany();
    await User.create([
      { username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
      { username: 'user', email: 'user@example.com', password: '123456', role: 'user' }
    ]);
    console.log('Seed done'); process.exit();
  }).catch(console.error);

/* ============ Đăng ký ============ */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============ Đăng nhập ============ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============ Quên mật khẩu ============ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản này" });

    // Tạo token reset ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 phút

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    console.log(`🔑 Token reset mật khẩu của ${email}: ${resetToken}`);

    res.json({
      message: "Token đặt lại mật khẩu đã được tạo!",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============ Đặt lại mật khẩu ============ */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
