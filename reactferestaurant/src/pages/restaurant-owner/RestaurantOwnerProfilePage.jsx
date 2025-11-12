/**
 * RestaurantOwnerProfilePage Component
 * Profile page for restaurant owner showing their restaurants and account info
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerProfilePage.css';

function RestaurantOwnerProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    return <Loading message="Đang tải thông tin..." />;
  }

  return (
    <div className="restaurant-owner-profile-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className="fas fa-user-circle me-2"></i>
            Hồ sơ nhà hàng
          </h1>
          <p className="page-subtitle-owner">
            Quản lý thông tin tài khoản và nhà hàng của bạn
          </p>
        </div>

        <Row>
          <Col lg={4}>
            {/* Account Info */}
            <Card className="profile-card-owner mb-4">
              <Card.Header className="card-header-owner">
                <i className="fas fa-user me-2"></i>
                Thông tin tài khoản
              </Card.Header>
              <Card.Body>
                <div className="account-info-owner">
                  <div className="avatar-section-owner mb-3">
                    <div className="avatar-circle-owner">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <h4 className="account-name-owner">{user?.fullName || user?.username}</h4>
                  <p className="account-email-owner text-muted">{user?.email}</p>
                  {user?.phone && (
                    <p className="account-phone-owner">
                      <i className="fas fa-phone me-2"></i>
                      {user.phone}
                    </p>
                  )}
                  {user?.address && (
                    <p className="account-address-owner">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {user.address}
                    </p>
                  )}
                  <div className="account-actions-owner mt-3">
                    <Link to="/auth/profile">
                      <Button variant="outline-primary" className="w-100">
                        <i className="fas fa-edit me-2"></i>
                        Chỉnh sửa thông tin
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card className="stats-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-chart-bar me-2"></i>
                Thống kê nhanh
              </Card.Header>
              <Card.Body>
                <div className="stat-item-owner">
                  <div className="stat-value-owner">{restaurants.length}</div>
                  <div className="stat-label-owner">Nhà hàng</div>
                </div>
                <div className="stat-item-owner">
                  <div className="stat-value-owner">0</div>
                  <div className="stat-label-owner">Tổng đặt bàn</div>
                </div>
                <div className="stat-item-owner">
                  <div className="stat-value-owner">0</div>
                  <div className="stat-label-owner">Đánh giá trung bình</div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {/* Restaurants List */}
            <div className="restaurants-section-owner">
              <div className="section-header-owner mb-3">
                <h3 className="section-title-owner">
                  <i className="fas fa-store me-2"></i>
                  Nhà hàng của tôi
                </h3>
                <Link to="/restaurant-owner/restaurants/new">
                  <Button variant="primary">
                    <i className="fas fa-plus me-2"></i>
                    Thêm nhà hàng mới
                  </Button>
                </Link>
              </div>

              {restaurants.length === 0 ? (
                <Card className="empty-state-card-owner">
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-store fa-3x text-muted mb-3"></i>
                    <h5>Chưa có nhà hàng nào</h5>
                    <p className="text-muted mb-4">
                      Bắt đầu bằng cách thêm nhà hàng đầu tiên của bạn.
                    </p>
                    <Link to="/restaurant-owner/restaurants/new">
                      <Button variant="primary">
                        <i className="fas fa-plus me-2"></i>
                        Thêm nhà hàng mới
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {restaurants.map((restaurant) => (
                    <Col md={6} key={restaurant.restaurantId || restaurant.id} className="mb-4">
                      <Card className="restaurant-card-owner">
                        <div className="restaurant-card-header-owner">
                          {restaurant.mainImageUrl ? (
                            <img
                              src={restaurant.mainImageUrl}
                              alt={restaurant.restaurantName}
                              className="restaurant-image-owner"
                            />
                          ) : (
                            <div className="restaurant-placeholder-owner">
                              <i className="fas fa-utensils"></i>
                            </div>
                          )}
                          <Badge
                            bg="success"
                            className="restaurant-status-badge-owner"
                          >
                            Hoạt động
                          </Badge>
                        </div>
                        <Card.Body>
                          <h5 className="restaurant-name-owner">
                            {restaurant.restaurantName}
                          </h5>
                          <p className="restaurant-address-owner text-muted">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {restaurant.address}
                          </p>
                          {restaurant.cuisineType && (
                            <Badge bg="info" className="mb-2">
                              {restaurant.cuisineType}
                            </Badge>
                          )}
                          <div className="restaurant-actions-owner mt-3">
                            <Link
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId || restaurant.id}/edit`}
                              className="me-2"
                            >
                              <Button variant="outline-primary" size="sm">
                                <i className="fas fa-edit me-1"></i>
                                Sửa
                              </Button>
                            </Link>
                            <Link
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId || restaurant.id}/tables`}
                              className="me-2"
                            >
                              <Button variant="outline-secondary" size="sm">
                                <i className="fas fa-table me-1"></i>
                                Bàn
                              </Button>
                            </Link>
                            <Link
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId || restaurant.id}/services`}
                            >
                              <Button variant="outline-secondary" size="sm">
                                <i className="fas fa-concierge-bell me-1"></i>
                                Dịch vụ
                              </Button>
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerProfilePage;

