require("dotenv").config();  // Đảm bảo dotenv được load để lấy các biến môi trường từ .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");  // Import express-fileupload

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();  // Khởi tạo ứng dụng Express

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));  // Cấu hình CORS
app.use(express.json({ limit: "10mb" }));  // Giới hạn kích thước body JSON là 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));  // Xử lý URL-encoded

// ✅ Middleware cho file upload (dùng express-fileupload)
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));  // Giới hạn file size upload tối đa 50MB

// ✅ Routes
app.use("/api/auth", authRoutes);  // Các route liên quan đến auth
app.use("/api/users", userRoutes);  // Các route liên quan đến user

// ✅ Kiểm tra các biến môi trường
console.log("MONGO_URI:", process.env.MONGO_URI);  // Kiểm tra URI MongoDB
console.log("PORT:", process.env.PORT);  // Kiểm tra PORT

// ✅ Kết nối MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);  // Dừng server nếu không thể kết nối MongoDB
  });

// ✅ Bắt lỗi route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint này!" });
});
