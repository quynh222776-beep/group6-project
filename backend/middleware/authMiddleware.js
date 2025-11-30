const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Lấy token từ header Authorization
  const token = req.header("Authorization")?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Không có token, bạn không có quyền truy cập" });
  }

  try {
    // Giải mã token với JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Lưu thông tin người dùng vào request để có thể sử dụng trong các route
    req.user = decoded;  // decoded chứa thông tin người dùng đã được giải mã từ token
    next();  // Tiến hành tiếp tục tới các route tiếp theo
  } catch (error) {
    // Nếu token không hợp lệ hoặc hết hạn
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authMiddleware;
