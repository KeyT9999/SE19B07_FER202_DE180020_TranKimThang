// Kiểu dáng toàn cục (Bootstrap + CSS của app)
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Routing (định tuyến giữa Register và Cars)
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// Trang/Component chính
import RegisterForm from './components/RegisterForm';
import CarManagement from './components/CarManagement';

function App() {
  // Theo dõi người dùng đã đăng ký thành công hay chưa
  const [isRegistered, setIsRegistered] = useState(false);

  // Khi app tải lần đầu: khôi phục cờ đăng ký từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('isRegistered');
    setIsRegistered(saved === 'true');
  }, []);

  // Gọi sau khi đăng ký thành công: lưu cờ và cập nhật UI
  const handleRegistered = () => {
    setIsRegistered(true);
    localStorage.setItem('isRegistered', 'true');
  };

  return (
    <BrowserRouter>
      {/* Thanh điều hướng (Navbar) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {/* Logo/brand dẫn tới trang Cars */}
          <NavLink className="navbar-brand" to="/cars">Car Manager</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Ẩn liên kết Register sau khi đã đăng ký */}
              {!isRegistered && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/cars">Cars</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Khu vực nội dung chính */}
      <main className="container py-4">
        <Routes>
          {/* Route trang đăng ký */}
          <Route path="/register" element={<RegisterForm onRegistered={handleRegistered} />} />
          {/* Route được bảo vệ: chỉ vào khi đã đăng ký */}
          <Route path="/cars" element={isRegistered ? <CarManagement /> : <Navigate to="/register" replace />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
