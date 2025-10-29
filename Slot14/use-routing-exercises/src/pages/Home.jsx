import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background dots */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px, 80px 80px, 60px 60px'
      }}></div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        maxWidth: '1200px',
        width: '100%',
        alignItems: 'center',
        zIndex: 1
      }}>
        {/* Left Section - Text and Buttons */}
        <div style={{ color: 'white' }}>
          {/* Premium Services Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '30px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>👑</span>
            Premium Services
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 20px',
            lineHeight: '1.2'
          }}>
            Chào mừng đến với
          </h1>

          {/* Store Name */}
          <h2 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            margin: '0 0 30px',
            lineHeight: '1.1'
          }}>
            <span style={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Tiệm Tạp Hóa KeyT
            </span>
          </h2>

          {/* Description */}
          <p style={{
            fontSize: '18px',
            margin: '0 0 40px',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            Khám phá các dịch vụ premium với giá tốt nhất. Netflix, Canva Pro, Spotify và nhiều hơn nữa!
          </p>

          {/* Call-to-Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/san-pham')}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '14px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>👁️</span>
              Xem dịch vụ
            </button>
          </div>
        </div>

        {/* Right Section - Service Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          position: 'relative'
        }}>
          {/* Netflix Card */}
          <div style={{
            backgroundColor: '#E50914',
            color: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(229, 9, 20, 0.3)',
            transform: 'translateY(-10px)',
            transition: 'transform 0.3s ease'
          }}>
            Netflix
          </div>

          {/* Spotify Card */}
          <div style={{
            backgroundColor: '#1DB954',
            color: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(29, 185, 84, 0.3)',
            transform: 'translateY(10px)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '24px' }}>🎵</div>
            Spotify
          </div>

          {/* Canva Card */}
          <div style={{
            background: 'linear-gradient(135deg, #00C4CC 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(0, 196, 204, 0.3)',
            transform: 'translateY(10px)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '24px' }}>🎨</div>
            Canva
          </div>

          {/* Drive Card */}
          <div style={{
            background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
            color: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(66, 133, 244, 0.3)',
            transform: 'translateY(-10px)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '24px' }}>☁️</div>
            Drive
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;