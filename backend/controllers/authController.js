// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Đường dẫn tới model User (sửa nếu khác)
const nodemailer = require("nodemailer");

// Đăng ký
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng ký", error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
};

// Đăng xuất
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công (client xóa token)" });
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  res.json({ message: "Tính năng quên mật khẩu đang được phát triển" });
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  res.json({ message: "Tính năng đặt lại mật khẩu đang được phát triển" });
};

// ✅ Export tất cả
module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
