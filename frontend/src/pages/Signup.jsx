import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      // Tạo formData để gửi file ảnh
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("📩 Signup result:", data);

      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại!");
        return;
      }

      alert("Đăng ký thành công! Vui lòng login.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Lỗi signup:", err);
      alert("Không thể kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi avatar
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Thêm trường tải ảnh avatar */}
          <input
            type="file"
            placeholder="Chọn ảnh đại diện"
            onChange={handleAvatarChange}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "📝 Đăng ký"}
          </button>
        </form>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
