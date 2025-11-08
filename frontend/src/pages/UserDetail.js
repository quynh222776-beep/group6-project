import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function UserDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
    role: "",
    avatar: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Không thể tải thông tin người dùng!");
          navigate("/home");
          return;
        }

        setUser(data);
        setUpdatedUser({
          username: data.username || "",
          email: data.email || "",
          role: data.role || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error("❌ Lỗi fetch user detail:", err);
        alert("Lỗi khi tải thông tin người dùng!");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, token]);

  // ==========================
  // 🧩 Xử lý Upload Avatar
  // ==========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUpdatedUser({ ...updatedUser, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ==========================
  // 💾 Gửi Cập Nhật
  // ==========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Cập nhật thất bại!");
        return;
      }

      alert("✅ Cập nhật thông tin thành công!");
      setUser(data);
      setEditing(false);
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      alert("Lỗi khi gửi yêu cầu cập nhật!");
    }
  };

  // ==========================
  // ❌ Xóa tài khoản
  // ==========================
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa tài khoản này không?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Không thể xóa tài khoản!");
        return;
      }

      alert("🗑️ Xóa tài khoản thành công!");
      localStorage.removeItem("token");
      navigate("/signup");
    } catch (err) {
      console.error("❌ Lỗi xóa tài khoản:", err);
      alert("Lỗi khi gửi yêu cầu xóa!");
    }
  };

  if (loading) return <p className="center-text">⏳ Đang tải thông tin...</p>;
  if (!user) return <p className="center-text">⚠️ Không tìm thấy người dùng!</p>;

  return (
    <div className="center-container">
      <div className="form-box">
        <h2>👤 Thông tin chi tiết người dùng</h2>

        {!editing ? (
          <>
            <div className="info-box">
              <p><b>ID:</b> {user._id}</p>
              <p><b>Tên đăng nhập:</b> {user.username}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Quyền:</b> {user.role}</p>

              {user.avatar ? (
                <div>
                  <p><b>Ảnh đại diện:</b></p>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    width="120"
                    style={{ borderRadius: "10px", marginTop: "8px" }}
                  />
                </div>
              ) : (
                <p><i>Không có avatar</i></p>
              )}
            </div>

            {/* 🧭 Nút điều hướng & thao tác */}
            <div className="action-buttons">
              <button className="btn" onClick={() => navigate("/home")}>
                🔙 Quay lại danh sách
              </button>
              <button className="btn btn-update" onClick={() => setEditing(true)}>
                ✏️ Cập nhật thông tin
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Xóa tài khoản
              </button>
            </div>
          </>
        ) : (
          // ==========================
          // 🧾 FORM CẬP NHẬT
          // ==========================
          <form onSubmit={handleUpdate}>
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              value={updatedUser.username}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, username: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
            />

            <label>Quyền:</label>
            <input
              type="text"
              value={updatedUser.role}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, role: e.target.value })
              }
            />

            <label>Ảnh đại diện:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {updatedUser.avatar && (
              <img
                src={updatedUser.avatar}
                alt="preview"
                width="120"
                style={{ borderRadius: "10px", marginTop: "8px" }}
              />
            )}

            <div className="edit-buttons">
              <button type="submit" className="btn">💾 Lưu thay đổi</button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => setEditing(false)}
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}