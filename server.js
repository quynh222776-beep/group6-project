// server.js
require("dotenv").config(); // Đọc biến môi trường từ .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import model User
const User = require("./database/models/user");

const app = express();
app.use(express.json());
app.use(cors());

// Lấy MONGO_URI và PORT từ file .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Theo dõi trạng thái connection (debug)
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

// Middleware log mỗi request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) console.log("📦 Body:", req.body);
  next();
});

// ✅ Route mẫu kiểm tra server
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ Route CRUD mẫu cho User
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách users", error: err });
  }
});

// Chạy server
app.listen(PORT, () => console.log(`🌍 Server đang chạy tại http://localhost:${PORT}`));