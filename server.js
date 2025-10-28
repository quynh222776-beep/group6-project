require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Import model User
const User = require("./database/models/User");

const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // ✅ Đường dẫn đúng

dotenv.config();


const authRoutes = require("./backend/routes/auth");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Middleware log request an toàn
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Body:", req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("🔍 Query:", req.query);
  }

  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Route test server
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
console.log("✅ Server connected and running on http://localhost:" + PORT);



});


app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

