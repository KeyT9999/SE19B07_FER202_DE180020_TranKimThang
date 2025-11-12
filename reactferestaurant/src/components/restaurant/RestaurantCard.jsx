/**
 * RestaurantCard Component
 * Card component to display restaurant information with new design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  const restaurantId = restaurant.id || restaurant.restaurantId;
  const roundedRating = Math.round(restaurant.averageRating || 0);
  const formattedRating = (restaurant.averageRating || 0).toFixed(1);
  
  // Check if restaurant is open based on opening hours
  const checkIsOpen = (openingHours) => {
    if (!openingHours) return true; // Default to open if no hours specified
    
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
      
      // Parse opening hours (format: "HH:MM - HH:MM")
      const match = openingHours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
      if (!match) return true; // If can't parse, assume open
      
      const openHour = parseInt(match[1]);
      const openMinute = parseInt(match[2]);
      const closeHour = parseInt(match[3]);
      const closeMinute = parseInt(match[4]);
      
      const openTime = openHour * 60 + openMinute;
      const closeTime = closeHour * 60 + closeMinute;
      
      // Handle case where restaurant closes after midnight (e.g., 17:00 - 24:00)
      if (closeTime < openTime) {
        // Restaurant closes after midnight
        return currentTime >= openTime || currentTime <= closeTime;
      } else {
        // Normal hours
        return currentTime >= openTime && currentTime <= closeTime;
      }
    } catch (error) {
      console.error('Error parsing opening hours:', error);
      return true; // Default to open on error
    }
  };
  
  const isOpen = checkIsOpen(restaurant.openingHours);

  return (
    <div
      className="restaurant-card-new"
      onClick={() => window.location.href = `/restaurants/${restaurantId}`}
    >
      <div className="restaurant-card-image-new">
        {restaurant.mainImageUrl ? (
          <img
            src={restaurant.mainImageUrl}
            alt={restaurant.restaurantName}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt={restaurant.restaurantName}
            loading="lazy"
          />
        )}
        
        {restaurant.averageRating >= 4.5 && (
          <div className="restaurant-badge-new">HOT</div>
        )}
      </div>
      
      <div className="restaurant-card-info-new">
        <h3 className="restaurant-name-new">{restaurant.restaurantName || 'Nhà hàng không tên'}</h3>
        
        <div className="restaurant-details-new">
          {restaurant.address && (
            <div className="restaurant-detail-item">
              <i className="fas fa-map-marker-alt icon"></i>
              <span>{restaurant.address}</span>
            </div>
          )}
          
          {restaurant.cuisineType && (
            <div className="restaurant-detail-item cuisine">
              <i className="fas fa-utensils icon"></i>
              <span>{restaurant.cuisineType}</span>
            </div>
          )}
          
          {restaurant.averagePrice && (
            <div className="restaurant-detail-item price">
              <i className="fas fa-money-bill-wave icon"></i>
              <span>₫{restaurant.averagePrice.toLocaleString('vi-VN')}/người</span>
            </div>
          )}
        </div>
        
        {restaurant.openingHours && (
          <div className={`restaurant-status-new ${isOpen ? 'open' : 'closed'}`}>
            <i className="fas fa-clock"></i>
            <span>{isOpen ? 'Đang mở cửa' : `Đóng cửa • Mở ${restaurant.openingHours.split(' - ')[0]}`}</span>
          </div>
        )}
        
        {restaurant.averageRating && restaurant.averageRating > 0 && (
          <div className="restaurant-rating-new">
            <div className="stars-new">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={star <= roundedRating ? 'fas fa-star' : 'far fa-star'}
                ></i>
              ))}
            </div>
            <span className="rating-text-new">{formattedRating} ({restaurant.reviewCount || 0} đánh giá)</span>
          </div>
        )}
        
        <Link
          to={`/restaurants/${restaurantId}`}
          className="restaurant-cta-new"
          onClick={(e) => e.stopPropagation()}
        >
          Đặt bàn ngay
        </Link>
      </div>
    </div>
  );
}

export default RestaurantCard;

