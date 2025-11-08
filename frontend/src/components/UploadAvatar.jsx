import React, { useState } from "react";
import axios from "axios";

export default function UploadAvatar({ currentAvatar, token }) {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(currentAvatar);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!avatar) {
      setMessage("Chưa chọn ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Cập nhật avatar thành công!");
      setPreview(res.data.avatarUrl);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi upload ảnh!");
    }
  };

  return (
    <div className="upload-avatar">
      <h3>Upload Avatar</h3>
      <img src={preview} alt="Avatar" width={120} height={120} style={{ borderRadius: "50%" }} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Cập nhật</button>
      {message && <p>{message}</p>}
    </div>
  );
}
