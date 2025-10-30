import React, { useState } from 'react';
import API from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/login', form);
      alert(res.data.message);
      // Lưu token
      if (res.data.token) localStorage.setItem('token', res.data.token);
      // (optional) lưu user info: localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
      <button type="submit">Login</button>
    </form>
  );
}
