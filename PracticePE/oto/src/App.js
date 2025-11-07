// Kiểu dáng toàn cục (Bootstrap + CSS của app)
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Routing (định tuyến giữa Register và Cars)
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';

// Trang/Component chính
import RegisterForm from './components/RegisterForm';
import CarManagement from './components/CarManagement';
import LoginForm from './components/LoginForm';

// Component NavBar với authentication
function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <div className="container">
        {/* Logo/brand dẫn tới trang Cars */}
        <Navbar.Brand as={NavLink} to="/cars">Car Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Hiển thị Register và Login nếu chưa đăng nhập */}
            {!isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            )}
            {/* Hiển thị Cars link */}
            <Nav.Link as={NavLink} to="/cars">Cars</Nav.Link>
            {/* Hiển thị user info và Logout nếu đã đăng nhập */}
            {isAuthenticated && user && (
              <NavDropdown title={`👤 ${user.username}`} id="user-dropdown" align="end">
                <NavDropdown.ItemText>
                  <small>{user.email}</small>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>🚪 Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

// Component App Routes (cần useAuth nên phải nằm trong AuthProvider)
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);

  // Khi app tải lần đầu: khôi phục cờ đăng ký từ localStorage (giữ logic cũ để tương thích)
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
    <>
      <NavBar />
      <main className="container py-4">
        <Routes>
          {/* Route trang đăng nhập */}
          <Route path="/login" element={<LoginForm />} />
          {/* Route trang đăng ký */}
          <Route path="/register" element={<RegisterForm onRegistered={handleRegistered} />} />
          {/* Route được bảo vệ: chỉ vào khi đã đăng nhập HOẶC đã đăng ký (tương thích với logic cũ) */}
          <Route path="/cars" element={(isAuthenticated || isRegistered) ? <CarManagement /> : <Navigate to="/login" replace />} />
          {/* Redirect mặc định */}
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route path="*" element={<Navigate to="/cars" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
