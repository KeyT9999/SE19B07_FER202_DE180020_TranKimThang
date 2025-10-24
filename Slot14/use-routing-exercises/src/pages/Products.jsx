import React from 'react';
import { useNavigate } from 'react-router-dom';

function Products() {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      name: "Netflix Premium",
      price: "89K / tháng",
      logo: "🎬",
      features: ["Ultra HD 4K", "4 thiết bị cùng lúc", "Không quảng cáo"],
      isHot: true,
      color: "#E50914"
    },
    {
      id: 2,
      name: "Canva Pro",
      price: "189K / năm",
      logo: "🎨",
      features: ["100GB lưu trữ", "Template premium", "Xóa nền AI"],
      isHot: false,
      color: "#00C4CC"
    },
    {
      id: 3,
      name: "Spotify Premium",
      price: "365K / năm",
      logo: "🎵",
      features: ["Chất lượng cao", "Tải về offline", "Không quảng cáo"],
      isHot: false,
      color: "#1DB954"
    },
    {
      id: 4,
      name: "Google Drive 2TB",
      price: "299K / năm",
      logo: "☁️",
      features: ["2TB dung lượng", "Đồng bộ tự động", "Bảo mật cao"],
      isHot: false,
      color: "#4285F4"
    },
    {
      id: 5,
      name: "Capcut Pro",
      price: "750K / năm",
      logo: "✂️",
      features: ["Hiệu ứng premium", "Không watermark", "AI tự động"],
      isHot: false,
      color: "#FF6B6B"
    },
    {
      id: 6,
      name: "Vieon VIP",
      price: "49K / tháng",
      logo: "📺",
      features: ["Phim độc quyền", "Không quảng cáo", "Xem offline"],
      isHot: false,
      color: "#FF8C00"
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Dịch Vụ Số Cao Cấp
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '18px' }}>
        Khám phá các dịch vụ số tuyệt vời với giá cả hợp lý!
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {products.map(product => (
          <div 
            key={product.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              transition: 'transform 0.3s ease',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {product.isHot && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ff4757',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                HOT
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: product.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                margin: '0 auto 15px'
              }}>
                {product.logo}
              </div>
              <h3 style={{ margin: '0 0 10px', color: '#333', fontSize: '20px' }}>
                {product.name}
              </h3>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: product.color,
                marginBottom: '15px'
              }}>
                {product.price}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#555', marginBottom: '10px', fontSize: '16px' }}>
                Tính năng nổi bật:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{ 
                    marginBottom: '8px', 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#666'
                  }}>
                    <span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate('/lien-he')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              💬 Liên hệ ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
