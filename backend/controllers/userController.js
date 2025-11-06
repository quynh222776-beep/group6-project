// backend/controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔧 Kiểm tra biến môi trường Cloudinary (tùy chọn)
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "✅ OK" : "❌ Missing"
);

// 🧱 Middleware xác thực token
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization: Bearer <token>
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; // Gắn thông tin user vào request
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// 🧾 Lấy danh sách user (chỉ Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // không trả password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID từ token

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.json({ message: "Xóa tài khoản thành công!" });
  } catch (err) {
    console.error("❌ Lỗi xóa tài khoản:", err);
    res.status(500).json({ message: "Lỗi server khi xóa tài khoản!" });
  }
};

// 📝 Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
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
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng ký", error: err.message });
  }
};

// 🔑 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo JWT Token (hết hạn sau 1h)
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // Gửi token về cho frontend
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng nhập", error: err.message });
  }
};

// 🚪 Đăng xuất (client xóa token)
exports.logout = async (req, res) => {
  res.json({ message: "Đăng xuất thành công (client xóa token)" });
};
