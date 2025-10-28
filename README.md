# 🚀 DỰ ÁN QUẢN LÝ NGƯỜI DÙNG (Group6 - DH22TIN02)

## 🎯 Giới thiệu dự án
Dự án này là sản phẩm cuối kỳ của **Nhóm6 - Lớp DH22TIN02**, môn **Thực hành Công nghệ phần mềm**.  
Mục tiêu của dự án là **xây dựng hệ thống quản lý người dùng (User Management System)** với các chức năng CRUD (Create, Read, Update, Delete), kết nối **Frontend – Backend – Database (MongoDB Atlas)**.

## ⚙️ Công nghệ sử dụng
### **Frontend**
- ReactJS (Vite)
- Axios để gọi API
- TailwindCSS cho giao diện
- Component tự xây dựng: `AddUser`, `UserList`

### **Backend**
- Node.js & Express.js
- Mongoose (kết nối MongoDB Atlas)
- Dotenv để quản lý biến môi trường
- CORS cho phép truy cập từ frontend

### **Database**
- MongoDB Atlas (Cloud Database)
- Bộ sưu tập (Collection): `users`
- Mỗi user gồm các trường:  
  ```js
  {
    _id: ObjectId,
    name: String,
    email: String,
    age: Number
  }
