const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");

// 📝 Đăng ký tài khoản
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được đăng ký!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 🔑 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Đăng nhập thành công!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại!" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExp = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      message: "Token reset (demo)",
      resetToken: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      email: decoded.email,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc hết hạn!" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Token không hợp lệ!" });
  }
};
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh!" });
    }

    const avatar = req.files.avatar;  // Lấy ảnh từ form-data

    const uploadRes = await cloudinary.uploader.upload(avatar.tempFilePath || avatar.data, {
      folder: "avatars",
      transformation: [
        { width: 150, height: 150, crop: "thumb" }, // Resize ảnh nếu cần
      ],
    });

    // Lưu URL ảnh vào cơ sở dữ liệu
    const user = await User.findById(req.user.id);
    user.avatar = uploadRes.secure_url;
    await user.save();

    res.json({
      message: "✅ Upload avatar thành công!",
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Cloudinary upload error: ", err);
    res.status(500).json({
      message: "❌ Lỗi upload avatar!",
      error: err.message || "Không có thông tin lỗi chi tiết",
    });
  }
};