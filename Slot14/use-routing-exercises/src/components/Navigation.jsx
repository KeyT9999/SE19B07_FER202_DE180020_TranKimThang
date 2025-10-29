import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '10px', 
      backgroundColor: '#f0f0f0', 
      marginBottom: '20px' 
    }}>
      {/* NavLink tự động thêm class 'active' nếu đường dẫn khớp */}
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        style={({ isActive }) => ({
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isActive ? '#007bff' : 'transparent',
          color: isActive ? 'white' : '#333',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        Trang Chủ
      </NavLink>

      <NavLink
        to="/san-pham"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        style={({ isActive }) => ({
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isActive ? '#007bff' : 'transparent',
          color: isActive ? 'white' : '#333',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        Sản Phẩm
      </NavLink>

      <NavLink
        to="/lien-he"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        style={({ isActive }) => ({
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isActive ? '#007bff' : 'transparent',
          color: isActive ? 'white' : '#333',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        Liên Hệ
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        style={({ isActive }) => ({
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isActive ? '#28a745' : 'transparent',
          color: isActive ? 'white' : '#333',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        📊 Dashboard
      </NavLink>
    </nav>
  );
}

export default Navigation;