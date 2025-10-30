import React, { useState } from 'react';
import API from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({ username:'', email:'', password:'' });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/signup', form);
      alert(res.data.message);
      // Lưu token nếu muốn auto-login
      if (res.data.token) localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={handleChange} value={form.username} />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
      <button type="submit">Sign Up</button>
    </form>
  );
}
