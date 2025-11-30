import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // ✅ Thêm import này

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Kiểm tra trạng thái đăng nhập khi ứng dụng load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token ? true : false;
    setIsLoggedIn(loggedIn);
  }, []);

  // ✅ Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* 🏠 Mặc định "/" */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        {/* 📝 Đăng ký */}
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/home" /> : <Signup />}
        />

        {/* 🔑 Đăng nhập */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* 🏠 Trang chủ */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 👤 Thông tin người dùng */}
        <Route
          path="/profile/:id"
          element={isLoggedIn ? <UserDetail /> : <Navigate to="/login" />}
        />

        {/* 🔐 Quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔄 Đặt lại mật khẩu bằng token */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
