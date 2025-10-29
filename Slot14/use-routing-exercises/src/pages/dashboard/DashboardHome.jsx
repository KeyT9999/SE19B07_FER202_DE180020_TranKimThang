import React from 'react';

function DashboardHome() {
  return (
    <div>
      <h1 style={{
        fontSize: '32px',
        marginBottom: '10px',
        color: '#2c3e50'
      }}>
        🏠 Trang Chủ Dashboard
      </h1>
      <p style={{
        color: '#7f8c8d',
        marginBottom: '30px'
      }}>
        Chào mừng bạn đến với Dashboard quản trị
      </p>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            👥
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Tổng người dùng
          </h3>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#3498db',
            margin: 0
          }}>
            1,234
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #2ecc71'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            📦
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Sản phẩm
          </h3>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2ecc71',
            margin: 0
          }}>
            567
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #f39c12'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            💰
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Doanh thu
          </h3>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#f39c12',
            margin: 0
          }}>
            890K
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #e74c3c'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            📊
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Đơn hàng
          </h3>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#e74c3c',
            margin: 0
          }}>
            456
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          margin: '0 0 20px',
          color: '#2c3e50'
        }}>
          ⚡ Hành động nhanh
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            ➕ Thêm sản phẩm
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            👥 Quản lý người dùng
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            📧 Gửi email
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            🔔 Thông báo
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
