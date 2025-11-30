const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: "user" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Mã hóa mật khẩu trước khi lưu vào database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Nếu mật khẩu không thay đổi thì không mã hóa lại
  try {
    const salt = await bcrypt.genSalt(10);  // Tạo salt cho mật khẩu
    this.password = await bcrypt.hash(this.password, salt);  // Mã hóa mật khẩu
    next();  // Tiến hành lưu vào cơ sở dữ liệu
  } catch (error) {
    next(error);  // Nếu có lỗi thì chuyển lỗi cho next
  }
});

// Tạo phương thức so sánh mật khẩu để dùng trong login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
