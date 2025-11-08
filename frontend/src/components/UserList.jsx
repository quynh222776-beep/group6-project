import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope } from "react-icons/fa";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const API = "http://localhost:3000/users";

  const loadUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi load users:", err);
    }
  };

  useEffect(() => {
    loadUsers();

    const handler = (e) => {
      const added = e.detail;
      if (added && added.id) setUsers((prev) => [...prev, added]);
      else loadUsers();
    };
    window.addEventListener("userAdded", handler);
    return () => window.removeEventListener("userAdded", handler);
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">📋 Danh sách User</h2>

      {users.length === 0 ? (
        <p className="muted">Chưa có user nào — hãy thêm thử.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="name-cell">
                  <FaUser className="icon-inline" /> {u.name}
                </td>
                <td>
                  <FaEnvelope className="icon-inline" /> {u.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}