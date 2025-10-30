// controllers/uploadController.js
const cloudinary = require("cloudinary").v2;

// ⚙️ Cấu hình Cloudinary (nếu bạn chưa có)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Chỉ có ở đây mới được dùng req
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Vui lòng chọn file để upload." });
    }

    // 📤 Upload file lên Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, uploadResult) => {
        if (error) {
          return res.status(500).json({ message: "Lỗi khi upload lên Cloudinary", error });
        }

        // 📦 Trả về URL file đã upload
        res.json({
          message: "Upload thành công!",
          userId,
          url: uploadResult.secure_url,
        });
      }
    );

    // Ghi dữ liệu vào stream
    file.stream.pipe(result);

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = { uploadAvatar };
