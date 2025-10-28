// controllers/userController.js

let users = [
  { id: 1, name: "Quỳnh" },
  { id: 2, name: "Hân" },
  { id: 3, name: "Khanh" },
];

const getUsers = (req, res) => res.json(users);

const addUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id == id);
  if (index === -1) return res.status(404).json({ message: "User not found" });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
