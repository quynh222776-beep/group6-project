import React from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

export default function App() {
  return (
    <div>
      <h1>🌸 Quản lý User 🌸 & 🚀 Backend cũng chỉnh sửa App.js</h1>
      <AddUser />
      <UserList />
    </div>
  );
}
