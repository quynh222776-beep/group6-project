import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Lấy token từ localStorage (đã lưu khi login)
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("Bạn cần đăng nhập trước!");
          navigate("/login");
          return;
        }

        // Gửi request lấy thông tin người dùng
        const res = await fetch(
          "https://unobscenely-colorimetrical-katelynn.ngrok-free.dev/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Không thể tải thông tin người dùng!");
          navigate("/login");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin user:", err);
        alert("Không thể kết nối tới server!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (loading) return <div className="center-container">⏳ Đang tải...</div>;

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>👤 Thông tin cá nhân</h2>
        {user ? (
          <div className="profile-info">
            <img
              src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="Avatar"
              className="avatar"
            />
            <p><strong>Tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.role && <p><strong>Vai trò:</strong> {user.role}</p>}
            <button className="btn" onClick={handleLogout}>🚪 Đăng xuất</button>
          </div>
        ) : (
          <p>Không có thông tin người dùng</p>
        )}
      </div>
    </div>
  );
}