import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function AuthForm() {
  // -------------------- STATE --------------------
  const [isLogin, setIsLogin] = useState(false); // false = đăng ký, true = đăng nhập
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Đường dẫn backend API (bạn giữ nguyên nếu server chạy localhost:5000)
  const API = "http://localhost:5000/api/auth";

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!email.trim() || !password.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    try {
      if (isLogin) {
        // ====== ĐĂNG NHẬP ======
        const res = await axios.post(`${API}/login`, { email, password });

        if (res.data.token) {
          // ✅ Lưu token
          localStorage.setItem("token", res.data.token);
          alert("✅ Đăng nhập thành công!");

          // ✅ Điều hướng theo role (nếu có)
          if (res.data.user?.role === "admin") {
            navigate("/users"); // Admin → trang quản lý người dùng
          } else {
            navigate("/profile"); // User thường → trang cá nhân
          }
        }
      } else {
        // ====== ĐĂNG KÝ ======
        if (!name.trim()) {
          alert("⚠️ Vui lòng nhập họ và tên!");
          return;
        }

        // ⚠️ Sửa đúng endpoint: register (không phải signup)
        const res = await axios.post(`${API}/register`, {
          username: name, // hoặc "name" nếu backend dùng name
          email,
          password,
        });

        alert("🎉 Đăng ký thành công! Hãy đăng nhập.");
        console.log(res.data);
        setIsLogin(true); // Chuyển sang chế độ đăng nhập
      }

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Lỗi:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Có lỗi xảy ra từ server!");
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-pink-200">
        <h2 className="text-2xl font-semibold text-center text-pink-600 mb-6">
          {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Ô nhập Họ và tên chỉ hiện khi đăng ký */}
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              className="border border-pink-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
              required={!isLogin}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-pink-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="border border-pink-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 shadow transition-all duration-200"
          >
            {isLogin ? (
              <>
                <FaSignInAlt /> Đăng nhập
              </>
            ) : (
              <>
                <FaUserPlus /> Đăng ký
              </>
            )}
          </button>
        </form>

        {/* Nút chuyển giữa đăng nhập / đăng ký */}
        <p className="text-center text-sm text-gray-600 mt-5">
          {isLogin ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-pink-600 hover:underline font-medium"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-pink-600 hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
