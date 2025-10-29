import React from 'react';

function Reports() {
  return (
    <div>
      <h1 style={{
        fontSize: '32px',
        marginBottom: '10px',
        color: '#2c3e50'
      }}>
        📈 Báo Cáo
      </h1>
      <p style={{
        color: '#7f8c8d',
        marginBottom: '30px'
      }}>
        Xem và tải xuống các báo cáo của bạn
      </p>

      {/* Report Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '15px'
          }}>
            📊
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Báo cáo doanh thu
          </h3>
          <p style={{
            margin: '0 0 15px',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            Tổng quan doanh thu trong tháng
          </p>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Tải xuống
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '15px'
          }}>
            👥
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Báo cáo người dùng
          </h3>
          <p style={{
            margin: '0 0 15px',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            Phân tích hành vi người dùng
          </p>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Tải xuống
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '15px'
          }}>
            📦
          </div>
          <h3 style={{
            margin: '0 0 10px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            Báo cáo sản phẩm
          </h3>
          <p style={{
            margin: '0 0 15px',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            Thống kê sản phẩm bán chạy
          </p>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Tải xuống
          </button>
        </div>
      </div>

      {/* Recent Reports */}
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
          📋 Báo cáo gần đây
        </h2>

        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          {[
            { name: 'Báo cáo tháng 1/2024', date: '15/01/2024', size: '2.5 MB' },
            { name: 'Báo cáo tháng 12/2023', date: '20/12/2023', size: '3.1 MB' },
            { name: 'Báo cáo tháng 11/2023', date: '18/11/2023', size: '2.8 MB' }
          ].map((report, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ecf0f1'
            }}>
              <div>
                <strong style={{ color: '#2c3e50' }}>{report.name}</strong>
                <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                  {report.date} • {report.size}
                </p>
              </div>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                ⬇️ Tải
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
