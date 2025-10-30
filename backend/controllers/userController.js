
// backend/controllers/userController.js
const User = require("../../database/models/user");


// Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách users", error: err });
  }
};

// Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "✅ Thêm user thành công", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi thêm user", error: err });
  }
};

// Cập nhật user theo ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "✅ Cập nhật user thành công", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi cập nhật user", error: err });
  }
};

// Xóa user theo ID
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Xóa user thành công" });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi xóa user", error: err });
  }
};
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// Đăng ký
const signup = async (req, res) => {
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
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng ký", error: err.message });
  }
};

// Đăng nhập
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

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập", error: err.message });
  }
};

// Đăng xuất (client xóa token)
const logout = async (req, res) => {
  res.json({ message: "Đăng xuất thành công (client xóa token)" });
};

module.exports = { signup, login, logout };

