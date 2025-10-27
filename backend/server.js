const express = require('express');
<<<<<<< HEAD
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
=======
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // ✅ Đường dẫn đúng
>>>>>>> d4b3da9b46db6fe2cae128fd48499d3b06a94665

dotenv.config();

const app = express();
<<<<<<< HEAD
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
=======
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ✅ Tạo route gốc /api
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
>>>>>>> d4b3da9b46db6fe2cae128fd48499d3b06a94665
