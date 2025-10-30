// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ✅ Các route CRUD người dùng
router.get("/", userController.getUsers);           // Lấy danh sách user
router.post("/", userController.createUser);        // Thêm user mới
router.put("/:id", userController.updateUser);      // Cập nhật user theo ID
router.delete("/:id", userController.deleteUser);   // Xóa user theo ID

module.exports = router;
