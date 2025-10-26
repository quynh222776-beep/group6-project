import React from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
export const API = "http://10.10.10.187:5000/api";

export default function App() {
  return (
    <div>
      <h1>🌸 Quản lý User 🌸 & 🚀 Backend cũng chỉnh sửa App.js</h1>
      <AddUser />
      <UserList />
    </div>
  );
}
