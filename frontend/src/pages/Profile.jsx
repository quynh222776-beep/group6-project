import React, { useEffect, useState } from "react";
import "../App.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user profile khi component load
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.message) {
          console.warn("⚠️ Backend message:", data.message);
          setUser(null);
          return;
        }

        setUser(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error("❌ Lỗi fetch profile:", err);
        setUser(null);
      }
    };

    fetchProfile();
  }, [token]);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ Bạn chưa đăng nhập!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message || "Cập nhật thành công!");
      if (data.user) {
        setUser(data.user);
        setFormData({
          username: data.user.username,
          email: data.user.email,
          password: "",
          avatar: data.user.avatar || "",
        });
      }
    } catch (err) {
      console.error("❌ Lỗi update profile:", err);
      setMessage("Cập nhật thất bại!");
    }
  };

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>👤 Thông tin cá nhân</h2>

        {user ? (
          <>
            <p><b>Tên đăng nhập:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            {user.avatar && (
              <div>
                <p><b>Avatar:</b></p>
                <img src={user.avatar} alt="avatar" width="100" />
              </div>
            )}

            <h3>Cập nhật thông tin</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
              />
              <button type="submit" className="btn">💾 Lưu thay đổi</button>
            </form>

            {message && <p className="success">{message}</p>}
          </>
        ) : (
          <p>⏳ Đang tải thông tin hoặc chưa có user nào...</p>
        )}
      </div>
    </div>
  );
}
