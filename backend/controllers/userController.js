// controllers/userController.js
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Lấy danh sách tất cả người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng", error: err.message });
  }
};

// ✅ Thêm người dùng mới (tạo tài khoản)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Tạo người dùng thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi tạo người dùng", error: err.message });
  }
};

// ✅ Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "✅ Cập nhật thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi cập nhật người dùng", error: err.message });
  }
};

// ✅ Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Xóa người dùng thành công" });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi xóa người dùng", error: err.message });
  }
};

// ✅ Đăng nhập (login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "✅ Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi server khi đăng nhập", error: err.message });
  }
};

// ✅ Đăng xuất (client tự xóa token)
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công (client tự xóa token)" });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
};
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ OK" : "❌ Missing");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware xác thực token
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// Lấy danh sách user (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    await user.deleteOne();
    res.json({ message: "Đã xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
