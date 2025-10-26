// backend/controllers/userController.js

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
