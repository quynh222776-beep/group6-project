const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const userId = req.user.id; // đã có từ verifyToken

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.log("⚠️ Không có file trong request");
      return res.status(400).json({ message: "Vui lòng chọn ảnh để upload" });
    }

    console.log("✅ File nhận được:", req.file.originalname);

    const buffer = req.file.buffer;

    cloudinary.uploader.upload_stream(
      { folder: "avatars", public_id: uuidv4(), resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload:", error);
          return res.status(500).json({ message: "Upload ảnh thất bại" });
        }

        console.log("✅ Upload thành công:", result.secure_url);
        return res.json({
          message: "Upload avatar thành công!",
          avatarUrl: result.secure_url,
        });
      }
    ).end(buffer);
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ message: error.message });
  }
};
