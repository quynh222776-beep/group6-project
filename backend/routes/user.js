const express = require('express');
const router = express.Router();
const { getUsers, addUser } = require('../controllers/userController');

// ✅ Lấy tất cả người dùng
router.get('/', getUsers);

// ✅ Thêm người dùng mới
router.post('/', addUser);

module.exports = router;
