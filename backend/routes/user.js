

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ Các route CRUD
router.get('/users', userController.getUsers);        // Lấy danh sách user
router.post('/users', userController.createUser);     // Thêm user mới
router.put('/users/:id', userController.updateUser);  // Sửa user theo id
router.delete('/users/:id', userController.deleteUser); // Xóa user theo id


module.exports = router;
