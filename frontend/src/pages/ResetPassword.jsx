import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Không có token reset mật khẩu.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      if (res.status === 200) {
        setSuccess(true);
        setMessage("Mật khẩu đã được đặt lại thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        {message && <p>{message}</p>}
        {success && <p className="success-message">Mật khẩu đã được đặt lại thành công!</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
