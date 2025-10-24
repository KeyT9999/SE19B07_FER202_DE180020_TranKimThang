import React from 'react';

function Contact() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px', fontSize: '32px' }}>
          Liên Hệ
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '18px' }}>
          Tiệm Tạp Hóa KeyT - Phục vụ khách hàng 24/7
        </p>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '30px', textAlign: 'center', fontSize: '24px' }}>
            Thông tin liên hệ
          </h2>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: '#007bff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏪
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '18px' }}>
                  Tên cửa hàng
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
                  Tiệm Tạp Hóa KeyT
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: '#25D366', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📱
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '18px' }}>
                  Zalo
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
                  0868899104
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: '#ea4335', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📧
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '18px' }}>
                  Email
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
                  kimthang.work@gmail.com
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: '#ffc107', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⏰
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '18px' }}>
                  Giờ làm việc
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
                  Làm việc 24/7 trừ giờ ngủ
                </p>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #2196f3',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#1976d2', margin: '0 0 10px', fontSize: '18px' }}>
              💬 Liên hệ ngay để được tư vấn!
            </h3>
            <p style={{ color: '#424242', margin: '0', fontSize: '16px' }}>
              Chúng tôi luôn sẵn sàng phục vụ và hỗ trợ khách hàng mọi lúc, mọi nơi!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
