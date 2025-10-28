const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const userController = require("../controllers/userController");

// Các route CRUD
router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
=======
const userController = require('../controllers/userController');

// ✅ Log để kiểm tra (có thể xóa sau)
console.log('UserController:', userController);

// ✅ Các route CRUD
router.get('/users', userController.getUsers);         // Lấy danh sách user
router.post('/users', userController.addUser);         // ✅ Thêm user (đúng tên hàm)
router.put('/users/:id', userController.updateUser);   // Sửa user theo id
router.delete('/users/:id', userController.deleteUser); // Xóa user theo id
>>>>>>> backend-update

module.exports = router;
