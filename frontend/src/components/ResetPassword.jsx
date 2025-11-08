import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Mật khẩu không khớp!");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/reset-password?token=${token}`, { password });
      setMessage(res.data.message || "Đổi mật khẩu thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
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
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
