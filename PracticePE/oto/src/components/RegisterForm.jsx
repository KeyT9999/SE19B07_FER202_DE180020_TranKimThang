// Trang Đăng ký: nhập username/email/password và lưu vào JSON Server
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carAPI from '../api/CarAPI';

export default function RegisterForm({ onRegistered }) {
  // State cục bộ cho form
  const [formValues, setFormValues] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // Ràng buộc 2 chiều cho các input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit: kiểm tra dữ liệu → POST lên JSON Server → alert → điều hướng
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.username || !formValues.email || !formValues.password) {
      window.alert('Please fill in all fields.');
      return;
    }
    try {
      // Thử POST tới '/Users' trước (đúng tên collection trong db.json). Nếu 404 thì thử '/users'.
      const payload = {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      };
      try {
        await carAPI.post('/Users', payload);
      } catch (err) {
        if (err?.response?.status === 404) {
          await carAPI.post('/users', payload);
        } else {
          throw err;
        }
      }
      window.alert(`Hello, ${formValues.username}! Your registration is successful.`);
      setFormValues({ username: '', email: '', password: '' });
      if (typeof onRegistered === 'function') {
        onRegistered();
      }
      navigate('/cars');
    } catch (err) {
      window.alert('Registration failed. Please make sure JSON Server is running on port 3001.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h4 className="card-title mb-2">Create your account</h4>
            <p className="text-muted mb-4">Register to continue to Car Manager</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control form-control-lg"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="e.g. john_doe"
                  required
                  minLength={3}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control form-control-lg"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control form-control-lg"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">Create account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

