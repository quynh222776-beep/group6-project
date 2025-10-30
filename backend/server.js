// ==========================
// 🌍 IMPORT MODULES
// ==========================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ==========================
// ⚙️ CẤU HÌNH MÔI TRƯỜNG
// ==========================
dotenv.config(); // Đặt ở ngay đầu tiên

// ==========================
// 🧠 KẾT NỐI DATABASE
// ==========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==========================
// 🚀 KHỞI TẠO APP
// ==========================
const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// 📦 IMPORT ROUTES
// ==========================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/uploadRoutes");

// ==========================
// 🌐 SỬ DỤNG ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// ==========================
// 🖥️ CHẠY SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
