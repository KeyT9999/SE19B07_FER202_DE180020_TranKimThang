import React from 'react';

function Settings() {
  return (
    <div>
      <h1 style={{
        fontSize: '32px',
        marginBottom: '10px',
        color: '#2c3e50'
      }}>
        ⚙️ Cài Đặt
      </h1>
      <p style={{
        color: '#7f8c8d',
        marginBottom: '30px'
      }}>
        Quản lý cài đặt hệ thống và tài khoản
      </p>

      {/* Settings Sections */}
      <div style={{
        display: 'grid',
        gap: '20px'
      }}>
        {/* General Settings */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            color: '#2c3e50',
            fontSize: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #ecf0f1'
          }}>
            📋 Cài đặt chung
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div>
                <strong style={{ color: '#2c3e50' }}>Ngôn ngữ hệ thống</strong>
                <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                  Chọn ngôn ngữ hiển thị
                </p>
              </div>
              <select style={{
                padding: '8px 15px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}>
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div>
                <strong style={{ color: '#2c3e50' }}>Chế độ tối</strong>
                <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                  Giao diện sáng/tối
                </p>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '60px',
                height: '30px'
              }}>
                <input type="checkbox" style={{
                  opacity: 0,
                  width: 0,
                  height: 0
                }} />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#ccc',
                  transition: '0.3s',
                  borderRadius: '30px'
                }}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            color: '#2c3e50',
            fontSize: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #ecf0f1'
          }}>
            🔔 Thông báo
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {['Email notifications', 'Push notifications', 'SMS alerts'].map((item, index) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <input type="checkbox" style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }} />
                <span style={{ color: '#2c3e50' }}>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            color: '#2c3e50',
            fontSize: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #ecf0f1'
          }}>
            🔒 Bảo mật
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: 'fit-content'
            }}>
              🔑 Đổi mật khẩu
            </button>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: 'fit-content'
            }}>
              🚪 Đăng xuất khỏi tất cả thiết bị
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px',
          paddingTop: '20px'
        }}>
          <button style={{
            padding: '12px 30px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Hủy
          </button>
          <button style={{
            padding: '12px 30px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
