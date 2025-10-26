// src/components/AddUser.jsx
import React, { useState } from "react";
import { API } from "../App";

export default function AddUser() {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("⚠️ Vui lòng nhập tên user!");
      return;
    }

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Thêm user thất bại");

      const newUser = await res.json();
      alert(`✅ Đã thêm user: ${newUser.name}`);
      setName("");

      // Sau khi thêm xong, reload danh sách
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi thêm user!");
    }
  };

  return (
    <div className="card">
      <h2>➕ Thêm User</h2>
      <input
        type="text"
        placeholder="Nhập tên user..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <button onClick={handleAdd} className="btn">
        Thêm
      </button>
    </div>
  );
}