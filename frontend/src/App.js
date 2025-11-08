import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UploadAvatar from "./components/UploadAvatar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const token = localStorage.getItem("token");

  // ✅ Dùng useCallback để tránh tạo lại hàm mới mỗi render
  const handleLoginStateChange = useCallback((value) => {
    setIsLoggedIn(value);
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Trang mặc định: login */}
        <Route path="/" element={<Login setIsLoggedIn={handleLoginStateChange} />} />

        {/* ✅ Đăng ký */}
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/home" /> : <Signup />}
        />

        {/* ✅ Đăng nhập */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={handleLoginStateChange} />
            )
          }
        />

        {/* ✅ Trang chủ sau khi đăng nhập */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={handleLoginStateChange} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Trang xem thông tin người dùng */}
        <Route
          path="/profile/:id"
          element={isLoggedIn ? <UserDetail /> : <Navigate to="/login" />}
        />

        {/* ✅ Quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Đặt lại mật khẩu */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Upload Avatar */}
        <Route
          path="/upload-avatar"
          element={
            isLoggedIn ? (
              <UploadAvatar token={token} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
