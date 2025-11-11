// controllers/userController.js
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Middleware xác thực token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; // Lưu thông tin user (id, role)
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// ✅ Lấy danh sách tất cả người dùng (chỉ admin)
const getUsers = async (req, res) => {
  try {
    // Nếu không phải admin thì chặn
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const users = await User.find().select("-password"); // ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách người dùng",
      error: err.message,
    });
  }
};

// ✅ Lấy thông tin người dùng hiện tại (role = user)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin user", error: err.message });
  }
};

// ✅ Đăng ký / tạo người dùng mới
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

// ✅ Đăng nhập
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

    res.json({
      message: "✅ Đăng nhập thành công!",
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi server khi đăng nhập", error: err.message });
  }
};

// ✅ Đăng xuất (client tự xóa token)
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công (client tự xóa token)" });
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

module.exports = {
  verifyToken,
  getUsers,
  getCurrentUser,
  createUser,
  login,
  logout,
  deleteUser,
};
