import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const API = "http://localhost:3000/users";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Vui lòng nhập tên và email.");
      return;
    }
    try {
      const res = await axios.post(API, { name, email });
      window.dispatchEvent(new CustomEvent("userAdded", { detail: res.data }));
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm user. Kiểm tra backend.");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title"><FaPlus /> Thêm User</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ tên"
          required
        />
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <button className="btn" type="submit"><FaPlus /> Thêm</button>
      </form>
    </div>
  );
}
