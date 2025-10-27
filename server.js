<<<<<<< HEAD
// server.js
require("dotenv").config(); // Đọc biến môi trường từ .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import routes & models
const userRoutes = require("./routes/user"); // Đường dẫn route user
const User = require("./database/models/User"); // Model User

const app = express();
<<<<<<< HEAD
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
=======
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ✅ Tạo route gốc /api
app.use('/api/users', userRoutes);

<<<<<<< HEAD
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
console.log("✅ Server connected and running on http://localhost:" + PORT);

=======

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
console.log("✅ Server connected and running on http://localhost:" + PORT);



});
