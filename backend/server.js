// ====== CẤU HÌNH ENV ======
const dotenv = require("dotenv");
dotenv.config();

// ====== IMPORT THƯ VIỆN ======
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
app.use(express.json());

// ✅ Cấu hình CORS cho phép React (localhost + ngrok)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://unobscenely-colorimetrical-katelynn.ngrok-free.dev",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Cho phép preflight (OPTIONS)
app.options("*", cors());

// ✅ Log mỗi request để debug
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log("🔑 Authorization:", req.headers.authorization);
  } else {
    console.log("⚠️ Không có Authorization header!");
  }
  if (req.body && Object.keys(req.body).length > 0)
    console.log("📦 Body:", req.body);
  next();
});

// ====== KẾT NỐI MONGODB ATLAS ======
mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// ====== ROUTE TEST SERVER ======
app.get("/", (req, res) => {
  res.send("🚀 Server đang chạy và đã kết nối MongoDB thành công!");
});

// ====== KHỞI ĐỘNG SERVER ======
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
