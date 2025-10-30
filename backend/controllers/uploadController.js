const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Dùng multer để lưu tạm file ảnh trước khi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Controller xử lý upload
exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Vui lòng chọn file để upload" });
      }

      // Upload lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      // Xóa file tạm sau khi upload xong
      fs.unlinkSync(req.file.path);

      res.json({
        message: "Upload avatar thành công!",
        avatarUrl: result.secure_url,
      });
    } catch (error) {
      console.error("❌ Lỗi upload:", error);
      res.status(500).json({ message: "Upload thất bại", error });
    }
  },
];
