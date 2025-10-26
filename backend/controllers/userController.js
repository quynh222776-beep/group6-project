
let users = [
  { id: 1, name: "Quỳnh" },
  { id: 2, name: "Hân" },
  { id: 3, name: "Khanh" }
];

// ✅ Lấy danh sách người dùng
const getUsers = (req, res) => {
  res.json(users);
};

// ✅ Thêm người dùng mới
const addUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, addUser };
