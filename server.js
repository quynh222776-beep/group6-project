// server.js
require("dotenv").config(); // Đọc biến môi trường từ .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import model User
const User = require("./backend/models/User");

const app = express();
app.use(express.json());
app.use(cors());

// Lấy MONGO_URI và PORT từ file .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// ✅ Kết nối MongoDB Atlas (không dùng option cũ nữa)
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Theo dõi trạng thái connection (debug)
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("💥 MongoDB connection error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

// 🧩 Middleware log mỗi request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) console.log("📦 Body:", req.body);
  next();
});

// 🧠 Route test server
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động bình thường!");
});

// 📋 Lấy danh sách user
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log("📄 GET /users:", users);
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi GET /users:", err);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu người dùng" });
  }
});

// ➕ Thêm user mới
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Vui lòng cung cấp cả name và email" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    console.log("✅ User mới đã được thêm:", newUser);
    res.status(201).json({ message: "Thêm người dùng thành công!", data: newUser });
  } catch (err) {
    console.error("❌ Lỗi POST /users:", err);
    res.status(500).json({ error: "Lỗi khi thêm người dùng" });
  }
});

// 🚀 Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
