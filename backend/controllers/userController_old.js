// backend/controllers/userController.js
<<<<<<< HEAD
const User = require("../../database/models/user");


// Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách users", error: err });
  }
};

// Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "✅ Thêm user thành công", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi thêm user", error: err });
  }
};

// Cập nhật user theo ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "✅ Cập nhật user thành công", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi cập nhật user", error: err });
  }
};

// Xóa user theo ID
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Xóa user thành công" });
  } catch (err) {
    res.status(400).json({ message: "❌ Lỗi khi xóa user", error: err });
  }
};
=======

// ✅ Mảng tạm lưu user
let users = [
  { id: 1, name: "Quỳnh" },
  { id: 2, name: "Hân" },
  { id: 3, name: "Khanh" },
];

// ✅ Lấy danh sách người dùng (GET)
const getUsers = (req, res) => {
  res.json(users);
};

// ✅ Thêm người dùng mới (POST)
const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

// ✅ Cập nhật người dùng (PUT)
const updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id == id);

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// ✅ Xóa người dùng (DELETE)
const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted" });
};

// ✅ Xuất module
module.exports = { getUsers, createUser, updateUser, deleteUser };
>>>>>>> backend-update
