/**
 * App.js - Component gốc của ứng dụng
 * 
 * Mục đích:
 * - Setup React Router để điều hướng giữa các trang
 * - Wrap toàn bộ app với AuthProvider
 * - Hiển thị Navbar và Routes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";      // Quản lý authentication (login/logout)

// Import Pages
import MovieManager from './pages/MovieManager';
import LoginForm from "./components/LoginForm";

/**
 * Navbar Component
 * Hiển thị navigation bar với các link và login/logout
 */
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Movie Manager
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Movies link - chỉ hiển thị khi đã đăng nhập */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/movies">
                  Movies
                </Link>
              </li>
            )}

            {/* Login/Logout link - Hiển thị dựa trên trạng thái đăng nhập */}
            {isAuthenticated ? (
              <>
                {/* Hiển thị username nếu đã đăng nhập */}
                <li className="nav-item">
                  <span className="nav-link text-light">
                    Welcome, {user?.username}!
                  </span>
                </li>
                {/* Logout button */}
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-light"
                    onClick={logout}
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              /* Login link - Hiển thị nếu chưa đăng nhập */
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/**
 * AppContent Component
 * Component chứa Navbar và Routes (cần nằm trong AuthProvider)
 */
function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Route: Login page */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Route: Movies page - chỉ hiển thị khi đã đăng nhập */}
        <Route path="/movies" element={<MovieManager />} />
        <Route path="/" element={<MovieManager />} />
      </Routes>
    </>
  );
}

/**
 * App Component
 * Component gốc - Setup Router và Providers
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
