/**
 * IntroSection Component
 * Introduction section with features and video
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import './IntroSection.css';

function IntroSection() {
  return (
    <section className="intro-section" id="intro">
      <Container>
        <div className="intro-container">
          <div className="intro-content">
            <h2>Nền tảng đặt bàn nhà hàng hàng đầu Việt Nam</h2>
            <p>
              Book Eat là giải pháp đặt bàn thông minh, kết nối bạn với hàng ngàn nhà hàng chất lượng cao 
              trên toàn quốc. Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất cho mọi thực khách.
            </p>
            <p>
              Với công nghệ hiện đại và dịch vụ chuyên nghiệp, việc đặt bàn chưa bao giờ dễ dàng đến thế. 
              Chỉ vài cú click, bạn đã có thể đảm bảo chỗ ngồi tại nhà hàng yêu thích.
            </p>
            
            <div className="intro-features">
              <div className="intro-feature">
                <div className="intro-feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="intro-feature-text">
                  <h4>Đặt bàn nhanh chóng</h4>
                  <p>Xác nhận tức thì trong vài giây</p>
                </div>
              </div>
              
              <div className="intro-feature">
                <div className="intro-feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="intro-feature-text">
                  <h4>An toàn & Bảo mật</h4>
                  <p>Thông tin được mã hóa bảo mật</p>
                </div>
              </div>
              
              <div className="intro-feature">
                <div className="intro-feature-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="intro-feature-text">
                  <h4>Chất lượng đảm bảo</h4>
                  <p>Nhà hàng được chọn lọc kỹ càng</p>
                </div>
              </div>
              
              <div className="intro-feature">
                <div className="intro-feature-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <div className="intro-feature-text">
                  <h4>Hỗ trợ 24/7</h4>
                  <p>Luôn sẵn sàng hỗ trợ bạn</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="intro-image">
            <iframe 
              src="https://www.youtube.com/embed/lcU3pruVyUw?autoplay=1&mute=1&loop=1&playlist=lcU3pruVyUw&controls=0&showinfo=0&rel=0&modestbranding=1"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Intro Video"
            />
            <div className="intro-video-overlay"></div>
            <div className="intro-stats">
              <div className="intro-stat">
                <span className="intro-stat-number">1,200+</span>
                <span className="intro-stat-label">Nhà hàng</span>
              </div>
              <div className="intro-stat">
                <span className="intro-stat-number">50K+</span>
                <span className="intro-stat-label">Khách hàng</span>
              </div>
              <div className="intro-stat">
                <span className="intro-stat-number">4.8</span>
                <span className="intro-stat-label">Đánh giá</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default IntroSection;

