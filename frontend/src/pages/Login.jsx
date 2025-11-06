import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📩 Login result:", data);

      if (!res.ok) {
        alert(data.message || "Đăng nhập thất bại!");
        return;
      }

      // ✅ Lưu token, user và role
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role); // thêm role
      }

      setIsLoggedIn(true);
      alert(`Chào mừng ${data.user?.username || "bạn"}!`);

      // ✅ Chuyển hướng tới trang Home (hiển thị danh sách user)
      navigate("/home");
    } catch (err) {
      console.error("❌ Lỗi login:", err);
      alert("Không thể kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "🔑 Đăng nhập"}
          </button>
        </form>
        <p>
          Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
