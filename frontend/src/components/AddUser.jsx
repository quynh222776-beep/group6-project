import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
<<<<<<< HEAD
  const API = "http://localhost:3000/users";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Vui lòng nhập tên và email.");
=======

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
>>>>>>> backend-update
      return;
    }
    try {
<<<<<<< HEAD
      const res = await axios.post(API, { name, email });
      window.dispatchEvent(new CustomEvent("userAdded", { detail: res.data }));
      setName("");
      setEmail("");
=======
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
>>>>>>> backend-update
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm user. Kiểm tra backend.");
    }
  };

  return (
    <div className="card">
<<<<<<< HEAD
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
=======
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
>>>>>>> backend-update
      </form>
    </div>
  );
}
