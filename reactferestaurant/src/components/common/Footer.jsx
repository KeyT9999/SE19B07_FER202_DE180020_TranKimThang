/**
 * Footer Component
 * Main footer for the application
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ds-footer">
      <div className="ds-container">
        <div className="ds-footer-content">
          <div className="ds-footer-section">
            <h4>Book Eat</h4>
            <p style={{ color: 'var(--ds-neutral-600)', fontSize: '14px', marginBottom: '1rem' }}>
              Nền tảng đặt bàn nhà hàng hàng đầu Việt Nam. 
              Kết nối khách hàng với những nhà hàng tốt nhất.
            </p>
          </div>
          <div className="ds-footer-section">
            <h4>Khám phá</h4>
            <ul>
              <li><Link to="/restaurants">Nhà hàng gần đây</Link></li>
              <li><Link to="/restaurants">Nhà hàng phổ biến</Link></li>
              <li><Link to="/restaurants">Nhà hàng mới</Link></li>
              <li><Link to="/restaurants">Ưu đãi đặc biệt</Link></li>
            </ul>
          </div>
          <div className="ds-footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/contact">Trung tâm trợ giúp</Link></li>
              <li><Link to="/terms-of-service">Điều khoản sử dụng</Link></li>
              <li><Link to="/terms-of-service">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className="ds-footer-section">
            <h4>Liên hệ</h4>
            <ul>
              <li><a href="tel:19001234">📞 1900 1234</a></li>
              <li><a href="mailto:support@bookeat.vn">✉️ support@bookeat.vn</a></li>
              <li><a href="#contact">📍 Đà Nẵng, Việt Nam</a></li>
            </ul>
          </div>
        </div>
        <div className="ds-footer-bottom">
          <p>&copy; {currentYear} Book Eat. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

