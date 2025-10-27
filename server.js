
// server.js
require("dotenv").config(); // Đọc biến môi trường từ .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./backend/routes/user"); // ✅ route

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Middleware log request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) console.log("📦 Body:", req.body);
  next();
});

// ✅ Route gốc kiểm tra server
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ Sử dụng route user
app.use("/api/users", userRoutes);


// ✅ Kết nối MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Theo dõi trạng thái MongoDB
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
