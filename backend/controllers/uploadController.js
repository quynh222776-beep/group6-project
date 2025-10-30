const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Hàm upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh để upload" });
    }

    // ✅ Lấy userId từ verifyToken (nếu bạn đã gắn middleware verifyToken)
    const userId = req.user ? req.user.id : null;

    console.log("📸 Upload avatar cho user:", userId);
    console.log("✅ File nhận được:", req.file.originalname);

    const buffer = req.file.buffer;

    // Upload lên Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatars", public_id: uuidv4(), resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload:", error);
          return res.status(500).json({ message: "Upload ảnh thất bại" });
        }

        // ✅ Nếu có userId → lưu URL vào DB
        if (userId) {
          await User.findByIdAndUpdate(userId, { avatar: result.secure_url });
        }

        res.json({
          message: "Upload avatar thành công!",
          avatarUrl: result.secure_url,
        });
      }
    );

    uploadStream.end(buffer);
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ message: error.message });
  }
};
