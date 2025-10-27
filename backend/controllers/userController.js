<<<<<<< HEAD
// controllers/userController.js

let users = []; // Mảng tạm lưu user

// GET /users - lấy danh sách user
=======

let users = [
  { id: 1, name: "Quỳnh" },
  { id: 2, name: "Hân" },
  { id: 3, name: "Khanh" }
];

// ✅ Lấy danh sách người dùng
>>>>>>> d4b3da9b46db6fe2cae128fd48499d3b06a94665
const getUsers = (req, res) => {
  res.json(users);
};

<<<<<<< HEAD
// POST /users - thêm user mới
const createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
=======
// ✅ Thêm người dùng mới
const addUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const newUser = { id: users.length + 1, name };
>>>>>>> d4b3da9b46db6fe2cae128fd48499d3b06a94665
  users.push(newUser);
  res.status(201).json(newUser);
};

<<<<<<< HEAD
// PUT /users/:id - sửa user
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

// DELETE /users/:id - xóa user
const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted" });
};

// ✅ Xuất ra đúng cách:
module.exports = { getUsers, createUser, updateUser, deleteUser };
// Hoạt động 7 - API PUT/DELETE User hoàn tất
=======
module.exports = { getUsers, addUser };
>>>>>>> d4b3da9b46db6fe2cae128fd48499d3b06a94665
