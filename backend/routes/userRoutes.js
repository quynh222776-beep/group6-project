// ==============================
// 📁 routes/userRoutes.js
// ==============================
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// ❌ XÓA dòng import không dùng
// const { updateUser } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");

// ==============================
// 🛡️ Middleware: verify token
// ==============================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token hoặc token sai định dạng" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    req.userId = decoded.id;
    next();
  });
}

// ==============================
// 👤 Lấy thông tin user hiện tại
// ==============================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==============================
// ✏️ Cập nhật thông tin user hiện tại
// ==============================
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    res.json({ message: "Cập nhật thông tin thành công!", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==============================
// 📋 Lấy danh sách user
// ==============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    let users;
    if (requestingUser.role === "admin") {
      users = await User.find().select("_id username email role");
    } else {
      users = [requestingUser];
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==============================
// 🔍 Xem thông tin chi tiết user theo ID
// ==============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    if (requestingUser.role !== "admin" && req.userId !== req.params.id) {
      return res.status(403).json({ message: "Bạn không có quyền xem thông tin người khác!" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });

    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi lấy user:", err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin user", error: err.message });
  }
});
// ==============================
// ❌ Xóa tài khoản (User tự xóa)
// ==============================
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json({ message: "Xóa tài khoản thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa tài khoản:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


module.exports = router;
