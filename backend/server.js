// server.js
require("dotenv").config(); // Đọc biến môi trường từ file .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ====== IMPORT ROUTES ======
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/uploadRoutes");

// ====== KHỞI TẠO APP ======
const app = express();
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ✅ Log mỗi request (debug)
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0)
    console.log("📦 Body:", req.body);
  if (req.query && Object.keys(req.query).length > 0)
    console.log("🔍 Query:", req.query);
  next();
});

// ====== KẾT NỐI MONGODB ATLAS ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ====== THEO DÕI TRẠNG THÁI MONGODB ======
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err));
mongoose.connection.on("disconnected", () =>
  console.log("⚠️ MongoDB disconnected")
);

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// ====== ROUTE TEST SERVER ======
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ====== KHỞI ĐỘNG SERVER ======
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
