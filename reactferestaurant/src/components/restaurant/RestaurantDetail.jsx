/**
 * RestaurantDetail Component
 * Displays detailed information about a restaurant
 */

import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaUtensils, FaClock, FaDollarSign } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import './RestaurantDetail.css';

function RestaurantDetail({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="restaurant-detail">
      <Card className="restaurant-info-card">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h1 className="restaurant-name">{restaurant.restaurantName}</h1>
              {restaurant.cuisineType && (
                <Badge bg="secondary" className="cuisine-badge mb-3">
                  <FaUtensils className="me-1" />
                  {restaurant.cuisineType}
                </Badge>
              )}
              {restaurant.description && (
                <p className="restaurant-description">{restaurant.description}</p>
              )}
            </Col>
            <Col md={4}>
              <div className="restaurant-meta-info">
                {restaurant.address && (
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="meta-item">
                    <FaPhone className="meta-icon" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.openingHours && (
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{restaurant.openingHours}</span>
                  </div>
                )}
                {restaurant.averagePrice && (
                  <div className="meta-item">
                    <FaDollarSign className="meta-icon" />
                    <span>Giá trung bình: {formatCurrency(restaurant.averagePrice)}</span>
                  </div>
                )}
                {restaurant.websiteUrl && (
                  <div className="meta-item">
                    <a
                      href={restaurant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      {restaurant.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RestaurantDetail;

