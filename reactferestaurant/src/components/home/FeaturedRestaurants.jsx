/**
 * FeaturedRestaurants Component
 * Displays featured restaurants on the home page
 */

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllRestaurants } from '../../services/restaurantService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../common/Loading';
import './FeaturedRestaurants.css';

function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getAllRestaurants();
        // Show first 6 restaurants as featured
        setRestaurants(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Không thể tải danh sách nhà hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="featured-restaurants-section">
        <Container>
          <Loading message="Đang tải nhà hàng..." />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-restaurants-section">
        <Container>
          <div className="error-message">{error}</div>
        </Container>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section className="featured-restaurants-section" id="restaurants">
        <Container>
          <div className="featured-section-header">
            <div className="featured-header-content">
              <h2 className="featured-title">Nhà hàng nổi bật</h2>
              <p className="featured-subtitle">Khám phá những địa điểm ẩm thực được yêu thích nhất</p>
            </div>
            <Link to="/restaurants" className="featured-view-all">
              Xem tất cả
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="featured-empty-state">
            <div className="empty-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h3>Đang cập nhật</h3>
            <p>Dữ liệu nhà hàng nổi bật đang được cập nhật. Vui lòng quay lại sau.</p>
            <Link to="/restaurants" className="btn-featured-primary">Xem tất cả nhà hàng</Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-restaurants-section" id="restaurants">
      <Container>
        <div className="featured-section-header">
          <div className="featured-header-content">
            <h2 className="featured-title">Nhà hàng nổi bật</h2>
            <p className="featured-subtitle">Khám phá những địa điểm ẩm thực được yêu thích nhất</p>
          </div>
          <Link to="/restaurants" className="featured-view-all">
            Xem tất cả
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        
        <div className="featured-restaurants-grid">
          {restaurants.slice(0, 3).map((restaurant) => {
            const roundedRating = Math.round(restaurant.averageRating || 0);
            const formattedRating = (restaurant.averageRating || 0).toFixed(1);
            const fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            
            return (
              <article 
                key={restaurant.id || restaurant.restaurantId}
                className="featured-restaurant-card"
                data-restaurant-id={restaurant.id || restaurant.restaurantId}
                onClick={() => window.location.href = `/restaurants/${restaurant.id || restaurant.restaurantId}`}
              >
                <div className="featured-card-image">
                  {restaurant.mainImageUrl ? (
                    <img 
                      src={restaurant.mainImageUrl}
                      alt={restaurant.restaurantName}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="featured-card-image-placeholder" 
                    style={{ background: fallbackGradient, display: restaurant.mainImageUrl ? 'none' : 'flex' }}
                  >
                    <i className="fas fa-utensils"></i>
                  </div>
                  
                  {restaurant.averageRating >= 4.5 && (
                    <div className="featured-card-badge">HOT</div>
                  )}
                  
                  <div className="featured-card-overlay">
                    <span className="overlay-text">Xem chi tiết</span>
                  </div>
                </div>
                
                <div className="featured-card-content">
                  <div className="featured-card-header">
                    <h3 className="featured-card-title">{restaurant.restaurantName}</h3>
                    {restaurant.averageRating > 0 && (
                      <div className="featured-card-rating">
                        <div className="featured-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i 
                              key={star}
                              className={star <= roundedRating ? 'fas fa-star featured-star-filled' : 'fas fa-star featured-star-empty'}
                            ></i>
                          ))}
                        </div>
                        <span className="featured-rating-score">{formattedRating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="featured-card-meta">
                    {restaurant.cuisineType && (
                      <>
                        <span className="featured-cuisine-type">{restaurant.cuisineType}</span>
                        {restaurant.address && <span className="featured-meta-separator">•</span>}
                      </>
                    )}
                    {restaurant.address && (
                      <span className="featured-location">{restaurant.address}</span>
                    )}
                  </div>
                  
                  <div className="featured-card-footer">
                    <div className="featured-card-stats">
                      <span className="featured-review-count">
                        {restaurant.reviewCount || 0} đánh giá
                      </span>
                      {restaurant.averagePrice && (
                        <span className="featured-price">
                          {formatCurrency(restaurant.averagePrice)}
                        </span>
                      )}
                    </div>
                    <Link 
                      to={`/restaurants/${restaurant.id || restaurant.restaurantId}`}
                      className="featured-book-button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-calendar-check"></i>
                      Đặt bàn ngay
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedRestaurants;

