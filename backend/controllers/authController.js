// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/refreshTokenModel");
const nodemailer = require("nodemailer");

// 🔑 Hàm tạo Access Token (15 phút)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role }, // ✅ thêm role
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// 🔁 Hàm tạo Refresh Token (7 ngày)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ thêm role vào refresh token
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🧩 Đăng ký
const signup = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role: "user", // ✅ mặc định là user
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Lỗi khi đăng ký", error: err.message });
  }
};

// 🧠 Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // ✅ Tạo token có chứa role
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ Lưu refresh token vào DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
};

// 🔄 Làm mới Access Token
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Thiếu refresh token" });

    const stored = await RefreshToken.findOne({ token });
    if (!stored) return res.status(403).json({ message: "Token không hợp lệ" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh token hết hạn" });

      // ✅ tạo lại access token với role từ decoded
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi làm mới token", error: err.message });
  }
};

// 🚪 Đăng xuất
const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Thiếu refresh token để đăng xuất" });

    await RefreshToken.findOneAndDelete({ token });
    res.json({ message: "Đăng xuất thành công, token đã bị thu hồi" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng xuất", error: err.message });
  }
};

// 📧 Quên mật khẩu
const forgotPassword = async (req, res) => {
  res.json({ message: "Tính năng quên mật khẩu đang được phát triển" });
};

// 🔁 Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  res.json({ message: "Tính năng đặt lại mật khẩu đang được phát triển" });
};

// 👤 Lấy thông tin người dùng hiện tại
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
