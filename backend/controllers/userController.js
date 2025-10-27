// backend/controllers/userController.js
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
