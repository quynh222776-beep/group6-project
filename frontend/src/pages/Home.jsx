import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" hoặc "user"

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Lấy thông tin đăng nhập từ localStorage
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (err) {
        console.error("❌ Lỗi parse user từ localStorage", err);
      }
    }

    // Gọi API lấy danh sách user
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("❌ Lỗi khi fetch users:", res.statusText);
          setUsers([]);
          return;
        }

        const data = await res.json();

        // Nếu là user bình thường → chỉ hiển thị chính mình
        if (role === "user" && parsedUser) {
          const userOnly = data.find((u) => u._id === parsedUser._id);
          setUsers(userOnly ? [userOnly] : []);
        } else {
          // Admin thấy tất cả
          setUsers(data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, token, role]);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="header">
        <h1>📋 Danh sách User</h1>
        <div className="user-info">
          {currentUser ? (
            <span className="username">
              👋 Xin chào, <b>{currentUser.username}</b> ({role})
            </span>
          ) : (
            <span className="username">Đang tải thông tin...</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Danh sách người dùng */}
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
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    {/* Nút xem thông tin dẫn tới /profile/:id */}
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
