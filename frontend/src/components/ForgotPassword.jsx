import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage(res.data.message || "Email reset đã được gửi!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi gửi email reset!");
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Gửi token reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
