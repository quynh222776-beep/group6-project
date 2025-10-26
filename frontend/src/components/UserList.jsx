// src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import { API } from "../App";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`);
      if (!res.ok) throw new Error("Không tải được danh sách user");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi tải danh sách user!");
    }
  };

  useEffect(() => {
    fetchUsers();

    // Khi user được thêm mới, reload danh sách
    window.addEventListener("userUpdated", fetchUsers);
    return () => window.removeEventListener("userUpdated", fetchUsers);
  }, []);

  return (
    <div className="card">
      <h2>📋 Danh sách User</h2>
      <ul>
        {users.length === 0 ? (
          <li>Chưa có user nào</li>
        ) : (
          users.map((u) => <li key={u.id}>{u.name}</li>)
        )}
      </ul>
    </div>
  );
}