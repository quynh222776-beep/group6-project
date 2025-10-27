// src/components/AddUser.jsx
import React, { useState } from "react";
import { API } from "../App";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Hàm thêm user có validation
  const handleAdd = async (e) => {
    e.preventDefault();

    // --- Validation dữ liệu ---
    if (!name.trim()) {
      alert("⚠️ Tên không được để trống!");
      return;
    }
    if (!email.trim()) {
      alert("⚠️ Email không được để trống!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Email không hợp lệ!");
      return;
    }

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error("Thêm user thất bại");

      const newUser = await res.json();
      alert(`✅ Đã thêm user: ${newUser.name}`);

      // Reset form
      setName("");
      setEmail("");

      // Reload danh sách user
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi thêm user!");
    }
  };

  return (
    <div className="card">
      <h2>➕ Thêm User</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nhập tên user..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="Nhập email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn">
          Thêm
        </button>
      </form>
    </div>
  );
}
