import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          margin: '0 0 30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #34495e',
          fontSize: '24px'
        }}>
          📊 Dashboard
        </h2>
        
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <NavLink
            to="/dashboard"
            end
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isActive ? '#3498db' : 'transparent',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: isActive ? 'bold' : 'normal'
            })}
          >
            <span>🏠</span>
            <span>Trang chủ</span>
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isActive ? '#3498db' : 'transparent',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: isActive ? 'bold' : 'normal'
            })}
          >
            <span>⚙️</span>
            <span>Cài đặt</span>
          </NavLink>

          <NavLink
            to="/dashboard/reports"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isActive ? '#3498db' : 'transparent',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: isActive ? 'bold' : 'normal'
            })}
          >
            <span>📈</span>
            <span>Báo cáo</span>
          </NavLink>
        </nav>

        {/* Info section */}
        <div style={{
          marginTop: '40px',
          padding: '15px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong>💡 Lợi ích:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Chia sẻ layout chung</li>
            <li>Quản lý code dễ dàng</li>
            <li>Dễ bảo trì & mở rộng</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '30px'
      }}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
