require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// =======================
// ✅ API ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// =======================
// ⚠️ Xử lý route không tồn tại
// =======================
app.use((req, res) => {
  res.status(404).json({ message: 'Route không tồn tại!' });
});