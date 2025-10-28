// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const userRoutes = require('./routes/user'); // ✅ Đường dẫn chính xác

dotenv.config();
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

// ✅ Tạo route gốc /api
app.use('/api/users', userRoutes);
app.use(cors());
app.use(express.json());

// ✅ Route gốc
app.use('/api', userRoutes);

// ✅ Test route (để kiểm tra server hoạt động)
app.get('/', (req, res) => {
  res.send('✅ Server is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
