const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Xác thực token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token hoặc token sai định dạng" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Kiểm tra quyền admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền admin" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyToken, isAdmin };
