/**
 * HeroSection Component
 * Video hero section with YouTube background
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="video-hero" id="home">
      <div className="video-background">
        <iframe 
          src="https://www.youtube.com/embed/xPPLbEFbCAo?autoplay=1&mute=1&loop=1&playlist=xPPLbEFbCAo&controls=0&showinfo=0&rel=0&modestbranding=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Hero Video Background"
        />
      </div>
      <div className="video-overlay">
        <div className="video-content">
          <h1 className="video-title">Khám phá ẩm thực tại Book Eat</h1>
          <p className="video-subtitle">Đặt bàn tại những nhà hàng tốt nhất với Book Eat</p>
          
          <div className="video-buttons">
            <Link to="/restaurants" className="btn-video">
              <i className="fas fa-utensils"></i>
              Khám phá ngay
            </Link>
            <a href="#intro" className="btn-video-outline">
              <i className="fas fa-play"></i>
              Xem thêm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

