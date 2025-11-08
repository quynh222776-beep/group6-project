import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    // Lấy thông tin user hiện tại từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("❌ Lỗi parse user từ localStorage:", err);
      }
    }

    const fetchUsers = async () => {
      try {
        // Lấy baseURL từ .env
        const baseURL = process.env.REACT_APP_API_URL;
        if (!baseURL) {
          console.error("❌ REACT_APP_API_URL chưa được thiết lập trong .env");
          return;
        }

        const url = role === "user" ? `${baseURL}/users/me` : `${baseURL}/users`;
        console.log("🔹 Fetching URL:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🔹 Status:", res.status);

        if (res.status === 401) {
          console.warn("⚠️ Token không hợp lệ hoặc hết hạn");
          localStorage.clear();
          setIsLoggedIn(false);
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("📦 Data từ API:", data);

        // Đảm bảo data là mảng
        setUsers(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("❌ Lỗi khi fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>📋 Danh sách User</h1>
        <div className="user-info">
          {currentUser ? (
            <span className="username">
              👋 Xin chào, <b>{currentUser.username || currentUser.name}</b> ({localStorage.getItem("role")})
            </span>
          ) : (
            <span className="username">Đang tải thông tin...</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <div className="user-list">
        {loading ? (
          <p>⏳ Đang tải dữ liệu...</p>
        ) : users.length === 0 ? (
          <p>⚠️ Chưa có user nào trong hệ thống!</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username || u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Link to={`/profile/${u._id}`}>
                      <button className="btn-small">👁 Xem thông tin</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
