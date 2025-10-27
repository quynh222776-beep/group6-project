// server.js
require("dotenv").config(); // Đọc biến môi trường từ .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import routes & models
const userRoutes = require("./routes/user"); // Đường dẫn route user
const User = require("./database/models/User"); // Model User

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route chính
app.use("/api/users", userRoutes);

// ✅ Kết nối MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Theo dõi trạng thái kết nối MongoDB
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

// ✅ Middleware log request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) console.log("📦 Body:", req.body);
  next();
});

// ✅ Route test
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

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server connected and running on http://localhost:${PORT}`);
});
