// ==============================
// 📁 controllers/uploadController.js
// ==============================
const cloudinary = require("cloudinary").v2;


// ⚙️ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ==============================
// 📤 Upload Avatar
// ==============================
const uploadAvatar = async (req, res) => {
  try {
    // ✅ req chỉ tồn tại trong hàm này, không được đặt bên ngoài
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Vui lòng chọn file để upload." });
    }

    // 📤 Upload file lên Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Lỗi khi upload lên Cloudinary",
            error: error.message,
          });
        }

        // ✅ Trả kết quả khi upload xong
        res.json({
          message: "Upload thành công!",
          userId,
          url: result.secure_url,
        });
      }
    );

    // 📦 Gửi dữ liệu file vào stream
    file.stream.pipe(stream);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = { uploadAvatar };
