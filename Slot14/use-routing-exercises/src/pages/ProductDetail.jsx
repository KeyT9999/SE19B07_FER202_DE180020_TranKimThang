import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  // Lấy productId từ URL bằng useParams
  const { productId } = useParams();
  
  // Hook để điều hướng bằng code
  const navigate = useNavigate();

  // Mock data - thông tin chi tiết sản phẩm
  const productDetails = {
    101: {
      name: 'Netflix Premium',
      price: '89K / tháng',
      description: 'Dịch vụ streaming phim và series hàng đầu thế giới',
      features: [
        'Ultra HD 4K chất lượng cao',
        'Xem trên 4 thiết bị cùng lúc',
        'Không có quảng cáo',
        'Thư viện nội dung khổng lồ',
        'Hỗ trợ tiếng Việt'
      ],
      logo: '🎬',
      color: '#E50914'
    },
    102: {
      name: 'Canva Pro',
      price: '189K / năm',
      description: 'Công cụ thiết kế đồ họa chuyên nghiệp',
      features: [
        '100GB dung lượng lưu trữ',
        'Truy cập hàng triệu template',
        'Công cụ xóa nền AI',
        'Thư viện ảnh và icon phong phú',
        'Xuất file chất lượng cao'
      ],
      logo: '🎨',
      color: '#00C4CC'
    },
    103: {
      name: 'Spotify Premium',
      price: '365K / năm',
      description: 'Nghe nhạc không giới hạn mọi lúc mọi nơi',
      features: [
        'Chất lượng âm thanh cao cấp',
        'Tải về để nghe offline',
        'Không có quảng cáo',
        'Hỗ trợ tải playlists',
        'Danh sách phát cá nhân hóa'
      ],
      logo: '🎵',
      color: '#1DB954'
    }
  };

  // Lấy thông tin sản phẩm từ productId
  const product = productDetails[productId];

  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
          Sản phẩm không tồn tại
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Không tìm thấy sản phẩm với ID: {productId}
        </p>
        <button
          onClick={() => navigate('/san-pham')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Quay lại trang sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e9ecef'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: product.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            {product.logo}
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              margin: '0 0 10px',
              color: '#333'
            }}>
              {product.name}
            </h1>
            <p style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: product.color,
              margin: 0
            }}>
              {product.price}
            </p>
          </div>
        </div>

        {/* Product ID */}
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <p style={{ margin: 0, color: '#1976d2' }}>
            <strong>Mã sản phẩm:</strong> {productId}
          </p>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>
            Mô tả sản phẩm
          </h2>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.6', 
            color: '#666',
            margin: 0
          }}>
            {product.description}
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
            Tính năng nổi bật
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {product.features.map((feature, index) => (
              <li key={index} style={{
                padding: '12px 0',
                borderBottom: index !== product.features.length - 1 ? '1px solid #e9ecef' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  color: '#28a745',
                  fontSize: '20px'
                }}>
                  ✓
                </span>
                <span style={{ fontSize: '16px', color: '#555' }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/san-pham')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5a6268';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Quay lại trang sản phẩm
          </button>

          <button
            onClick={() => navigate('/lien-he')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            💬 Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
