/**
 * RestaurantOwnerRestaurantsPage Component
 * List of restaurants owned by the restaurant owner
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerRestaurantsPage.css';

function RestaurantOwnerRestaurantsPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants');
      const restaurantsData = Array.isArray(response.data) ? response.data : [];
      // TODO: Filter by ownerId when available
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setErrorWithTimeout('Không thể tải danh sách nhà hàng.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <Loading message="Đang tải danh sách nhà hàng..." />;
  }

  return (
    <div className="restaurant-owner-restaurants-page">
      <Container>
        <div className="page-header-owner mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title-owner">
                <i className="fas fa-store me-2"></i>
                Nhà hàng của tôi
              </h1>
              <p className="page-subtitle-owner">Quản lý tất cả nhà hàng của bạn</p>
            </div>
            <Link to="/restaurant-owner/restaurants/new">
              <Button variant="success" className="btn-add-restaurant-owner">
                <i className="fas fa-plus-circle me-2"></i>
                Thêm nhà hàng mới
              </Button>
            </Link>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-store fa-3x text-muted mb-3"></i>
              <h5>Chưa có nhà hàng nào</h5>
              <p className="text-muted mb-4">Bắt đầu bằng cách thêm nhà hàng đầu tiên của bạn!</p>
              <Link to="/restaurant-owner/restaurants/new">
                <Button variant="success">
                  <i className="fas fa-plus-circle me-2"></i>
                  Thêm nhà hàng mới
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {restaurants.map((restaurant) => (
              <Col md={6} lg={4} key={restaurant.restaurantId} className="mb-4">
                <Card className="restaurant-card-owner">
                  {restaurant.mainImageUrl && (
                    <Card.Img
                      variant="top"
                      src={restaurant.mainImageUrl}
                      className="restaurant-image-owner"
                    />
                  )}
                  <Card.Body>
                    <div className="restaurant-header-owner">
                      <h5 className="restaurant-name-owner">{restaurant.restaurantName}</h5>
                      <Badge bg="info">{restaurant.cuisineType}</Badge>
                    </div>
                    <div className="restaurant-info-owner">
                      <p className="mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        {restaurant.address}
                      </p>
                      {restaurant.phone && (
                        <p className="mb-2">
                          <i className="fas fa-phone me-2 text-primary"></i>
                          {restaurant.phone}
                        </p>
                      )}
                      {restaurant.averageRating && (
                        <p className="mb-2">
                          <i className="fas fa-star me-2 text-warning"></i>
                          {restaurant.averageRating.toFixed(1)} ({restaurant.reviewCount || 0} đánh giá)
                        </p>
                      )}
                      {restaurant.averagePrice && (
                        <p className="mb-0">
                          <i className="fas fa-money-bill-wave me-2 text-success"></i>
                          {formatCurrency(restaurant.averagePrice)}
                        </p>
                      )}
                    </div>
                    <div className="restaurant-actions-owner">
                      <Link to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/edit`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="fas fa-edit me-1"></i>
                          Sửa
                        </Button>
                      </Link>
                      <Link to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/tables`}>
                        <Button variant="outline-secondary" size="sm" className="me-2">
                          <i className="fas fa-table me-1"></i>
                          Bàn
                        </Button>
                      </Link>
                      <Link to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/services`}>
                        <Button variant="outline-secondary" size="sm" className="me-2">
                          <i className="fas fa-concierge-bell me-1"></i>
                          Dịch vụ
                        </Button>
                      </Link>
                      <Link to={`/restaurants/${restaurant.restaurantId}`}>
                        <Button variant="outline-info" size="sm">
                          <i className="fas fa-eye me-1"></i>
                          Xem
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default RestaurantOwnerRestaurantsPage;

