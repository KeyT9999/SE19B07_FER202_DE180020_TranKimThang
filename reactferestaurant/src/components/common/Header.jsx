/**
 * Header Component
 * Main navigation header for the application
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="ds-navbar">
      <div className="ds-container">
        <div className="ds-navbar-content">
          <Link to="/" className="ds-navbar-brand">
            Book Eat
          </Link>
          
          <ul className="ds-navbar-nav">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link 
                to="/restaurants" 
                className={isActive('/restaurants') ? 'active' : ''}
              >
                Nhà hàng
              </Link>
            </li>
            {isAuthenticated && user?.role === 'admin' && (
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={`admin-nav-link ${isActive('/admin/dashboard') || location.pathname.startsWith('/admin') ? 'active' : ''}`}
                >
                  <i className="fas fa-cog me-1"></i>
                  Quản lý
                </Link>
              </li>
            )}
            {isAuthenticated && user?.role === 'restaurant_owner' && (
              <li>
                <Link 
                  to="/restaurant-owner/dashboard" 
                  className={`restaurant-owner-nav-link ${isActive('/restaurant-owner/dashboard') || location.pathname.startsWith('/restaurant-owner') ? 'active' : ''}`}
                >
                  <i className="fas fa-store me-1"></i>
                  Nhà hàng
                </Link>
              </li>
            )}
          </ul>
          
          <div className="ds-navbar-actions">
            {!isAuthenticated ? (
              <>
                <button 
                  type="button" 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </button>
                <Link 
                  to="/register" 
                  className="ds-btn ds-btn-primary"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="ds-user-actions">
                <div className="ds-user-dropdown" ref={dropdownRef}>
                  <button 
                    className="ds-btn ds-btn-secondary dropdown-toggle" 
                    type="button" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    <i className="fas fa-user-circle"></i>
                    <span>{user?.username || 'User'}</span>
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/auth/profile"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fas fa-user"></i>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/booking/my"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fas fa-calendar-check"></i>
                          My Reservations
                        </Link>
                      </li>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/customer/favorites"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fas fa-star"></i>
                          Favorites
                        </Link>
                      </li>
                      {user?.role === 'admin' && (
                        <>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <h6 className="dropdown-header">
                              <i className="fas fa-shield-alt me-1"></i>
                              Quản trị viên
                            </h6>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item admin-dropdown-item" 
                              to="/admin/dashboard"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-tachometer-alt me-2"></i>
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item admin-dropdown-item" 
                              to="/admin/users"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-users me-2"></i>
                              Quản lý người dùng
                            </Link>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item admin-dropdown-item" 
                              to="/admin/restaurants"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-utensils me-2"></i>
                              Quản lý nhà hàng
                            </Link>
                          </li>
                        </>
                      )}
                      {user?.role === 'restaurant_owner' && (
                        <>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <h6 className="dropdown-header">
                              <i className="fas fa-store me-1"></i>
                              Chủ nhà hàng
                            </h6>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item restaurant-owner-dropdown-item" 
                              to="/restaurant-owner/dashboard"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-tachometer-alt me-2"></i>
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item restaurant-owner-dropdown-item" 
                              to="/restaurant-owner/restaurants"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-store me-2"></i>
                              Nhà hàng của tôi
                            </Link>
                          </li>
                          <li>
                            <Link 
                              className="dropdown-item restaurant-owner-dropdown-item" 
                              to="/restaurant-owner/bookings"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <i className="fas fa-calendar-check me-2"></i>
                              Đặt bàn
                            </Link>
                          </li>
                        </>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i>
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

