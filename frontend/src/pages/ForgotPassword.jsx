import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);

    try {
      // Gửi yêu cầu quên mật khẩu tới backend
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });


      if (res.data.token) {
        setMessage("Token reset đã được tạo, dùng để đổi mật khẩu.");
        setToken(res.data.token);  // Lưu token reset mật khẩu
      } else {
        setMessage("Có lỗi xảy ra khi tạo token.");
      }
    } catch (err) {
      setMessage("Không thể kết nối server hoặc có lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="form-box">
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </form>

        {message && <p>{message}</p>}

        {token && (
          <div className="token-container">
            <h4>Token:</h4>
            <textarea
              readOnly
              rows="4"
              value={token}
              style={{ width: "100%", fontSize: "14px" }}
            />
            <a
              href={`/reset-password/${token}`}
              className="btn"
              style={{ marginTop: "10px" }}
            >
              Đổi mật khẩu
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
