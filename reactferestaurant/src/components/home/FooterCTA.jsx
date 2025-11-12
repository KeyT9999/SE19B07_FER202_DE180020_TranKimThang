/**
 * FooterCTA Component
 * Footer call-to-action section with video background
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './FooterCTA.css';

function FooterCTA() {
  return (
    <section className="footer-video-cta">
      <div className="footer-video-background">
        <iframe 
          src="https://www.youtube.com/embed/lcU3pruVyUw?autoplay=1&mute=1&loop=1&playlist=lcU3pruVyUw&controls=0&showinfo=0&rel=0&modestbranding=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Footer CTA Video"
        />
      </div>
      <div className="footer-video-overlay">
        <div className="footer-video-content">
          <h2 className="footer-video-title">Bắt đầu trải nghiệm ngay hôm nay</h2>
          <p className="footer-video-subtitle">Đặt bàn nhanh chóng, dễ dàng và miễn phí</p>
          <div className="footer-video-buttons">
            <Link to="/restaurants" className="btn-footer-video">
              <i className="fas fa-calendar-check"></i>
              Đặt bàn ngay
            </Link>
            <Link to="/register" className="btn-footer-video-outline">
              <i className="fas fa-store"></i>
              Dành cho nhà hàng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterCTA;

