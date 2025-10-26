const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // ✅ Đường dẫn đúng

dotenv.config();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ✅ Tạo route gốc /api
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
