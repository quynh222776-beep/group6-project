const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =============================
   1️⃣ Middleware kiểm tra JWT
============================= */
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Lưu id người dùng vào request
    req.role = decoded.role; // Lưu vai trò người dùng nếu có
    next();
  } catch (error) {
    res.status(400).json({ message: "Token không hợp lệ!" });
  }
};

/* =============================
   2️⃣ Middleware kiểm tra quyền admin
============================= */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này!" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
  }
};

module.exports = { verifyToken, isAdmin };
