// src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");

  // 📌 Lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi tải danh sách user!");
    }
  };

  useEffect(() => {
    fetchUsers();
    window.addEventListener("userUpdated", fetchUsers);
    return () => window.removeEventListener("userUpdated", fetchUsers);
  }, []);

  // 🗑️ Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await axios.delete(`${API}/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa user!");
    }
  };

  // ✏️ Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
  };

  // 💾 Lưu thay đổi (PUT)
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API}/users/${editingUser.id}`, {
        name: editName,
      });
      // Cập nhật lại danh sách sau khi sửa
      setUsers(
        users.map((u) => (u.id === editingUser.id ? res.data : u))
      );
      setEditingUser(null);
      setEditName("");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật user!");
    }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <h2>📋 Danh sách User</h2>

      {users.length === 0 ? (
        <p>Chưa có user nào</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <li key={u.id} style={{ marginBottom: 10 }}>
              {editingUser && editingUser.id === u.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ marginRight: 8 }}
                  />
                  <button onClick={handleUpdate}>💾 Lưu</button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setEditName("");
                    }}
                    style={{ marginLeft: 4 }}
                  >
                    ❌ Hủy
                  </button>
                </>
              ) : (
                <>
                  <span>{u.name}</span>
                  <button
                    onClick={() => handleEdit(u)}
                    style={{ marginLeft: 10 }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{ marginLeft: 5 }}
                  >
                    🗑️ Xóa
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
