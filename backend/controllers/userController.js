// controllers/userController.js

let users = []; // Mảng tạm lưu user

// GET /users - lấy danh sách user
const getUsers = (req, res) => {
  res.json(users);
};

// POST /users - thêm user mới
const createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
};

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
