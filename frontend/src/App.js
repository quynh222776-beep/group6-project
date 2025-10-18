import React from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

export default function App() {
  return (
    <div className="app-bg">
      <div className="app-container">
        <header className="app-header">
          <h1>🌸 Quản lý User 🌸</h1>
        </header>

        <main className="main-grid">
          <AddUser />
          <UserList />
        </main>
      </div>
    </div>
  );
}
