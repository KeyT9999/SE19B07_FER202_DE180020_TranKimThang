/**
 * RestaurantOwnerDashboardPage Component
 * Dashboard for restaurant owners with statistics and quick actions
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerDashboardPage.css';

function RestaurantOwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalBookings: 0,
    pendingBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurants owned by this user
      const restaurantsRes = await api.get('/restaurants');
      const allRestaurants = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      // Filter by owner (assuming restaurant has ownerId field, or we'll use userId)
      // For now, we'll show all restaurants (in real app, filter by ownerId)
      const ownerRestaurants = allRestaurants; // TODO: Filter by ownerId when available
      setRestaurants(ownerRestaurants);
      
      // Load bookings for owner's restaurants
      const bookingsRes = await api.get('/bookings');
      const allBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      const ownerRestaurantIds = ownerRestaurants.map(r => r.restaurantId);
      const ownerBookings = allBookings.filter(b => 
        ownerRestaurantIds.includes(b.restaurantId)
      );
      
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = ownerBookings.filter(b => {
        const bookingDate = new Date(b.bookingTime).toISOString().split('T')[0];
        return bookingDate === today;
      });
      
      const totalRevenue = ownerBookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);
      
      setStats({
        totalRestaurants: ownerRestaurants.length,
        totalBookings: ownerBookings.length,
        pendingBookings: ownerBookings.filter(b => b.status === 'PENDING').length,
        todayBookings: todayBookings.length,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    return <Loading message="Đang tải dashboard..." />;
  }

  return (
    <div className="restaurant-owner-dashboard-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard Nhà hàng
          </h1>
          <p className="page-subtitle-owner">Quản lý và theo dõi nhà hàng của bạn</p>
        </div>

        {/* Statistics Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body>
                <div className="stat-icon-owner restaurants">
                  <i className="fas fa-store"></i>
                </div>
                <h3 className="stat-value-owner">{stats.totalRestaurants}</h3>
                <p className="stat-label-owner">Nhà hàng</p>
                <Link to="/restaurant-owner/restaurants" className="stat-link-owner">
                  Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body>
                <div className="stat-icon-owner bookings">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3 className="stat-value-owner">{stats.totalBookings}</h3>
                <p className="stat-label-owner">Tổng đặt bàn</p>
                <Link to="/restaurant-owner/bookings" className="stat-link-owner">
                  Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body>
                <div className="stat-icon-owner pending">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="stat-value-owner">{stats.pendingBookings}</h3>
                <p className="stat-label-owner">Chờ xác nhận</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body>
                <div className="stat-icon-owner revenue">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <h3 className="stat-value-owner">{formatCurrency(stats.totalRevenue)}</h3>
                <p className="stat-label-owner">Tổng doanh thu</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="quick-action-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-bolt me-2"></i>
                Thao tác nhanh
              </Card.Header>
              <Card.Body>
                <div className="quick-actions-owner">
                  <Link to="/restaurant-owner/restaurants/new" className="quick-action-btn-owner">
                    <i className="fas fa-plus-circle me-2"></i>
                    Thêm nhà hàng mới
                  </Link>
                  <Link to="/restaurant-owner/restaurants" className="quick-action-btn-owner">
                    <i className="fas fa-store me-2"></i>
                    Quản lý nhà hàng
                  </Link>
                  <Link to="/restaurant-owner/bookings" className="quick-action-btn-owner">
                    <i className="fas fa-calendar-check me-2"></i>
                    Xem đặt bàn
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="info-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin hôm nay
              </Card.Header>
              <Card.Body>
                <div className="info-item-owner">
                  <span className="info-label-owner">Đặt bàn hôm nay:</span>
                  <Badge bg="primary" className="ms-2">{stats.todayBookings}</Badge>
                </div>
                <div className="info-item-owner">
                  <span className="info-label-owner">Chờ xác nhận:</span>
                  <Badge bg="warning" className="ms-2">{stats.pendingBookings}</Badge>
                </div>
                <div className="info-item-owner">
                  <span className="info-label-owner">Trạng thái:</span>
                  <Badge bg="success" className="ms-2">Hoạt động bình thường</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Restaurants */}
        {restaurants.length > 0 && (
          <Row className="mt-4">
            <Col>
              <Card className="recent-restaurants-card-owner">
                <Card.Header className="card-header-owner">
                  <i className="fas fa-store me-2"></i>
                  Nhà hàng của tôi
                </Card.Header>
                <Card.Body>
                  <Row>
                    {restaurants.slice(0, 4).map((restaurant) => (
                      <Col md={6} key={restaurant.restaurantId} className="mb-3">
                        <div className="restaurant-item-owner">
                          <div className="restaurant-item-header-owner">
                            <h5>{restaurant.restaurantName}</h5>
                            <Badge bg="info">{restaurant.cuisineType}</Badge>
                          </div>
                          <p className="restaurant-item-address-owner">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {restaurant.address}
                          </p>
                          <div className="restaurant-item-actions-owner">
                            <Link 
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/edit`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="fas fa-edit me-1"></i>
                              Sửa
                            </Link>
                            <Link 
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/tables`}
                              className="btn btn-sm btn-outline-secondary me-2"
                            >
                              <i className="fas fa-table me-1"></i>
                              Bàn
                            </Link>
                            <Link 
                              to={`/restaurant-owner/restaurants/${restaurant.restaurantId}/services`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              <i className="fas fa-concierge-bell me-1"></i>
                              Dịch vụ
                            </Link>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  {restaurants.length > 4 && (
                    <div className="text-center mt-3">
                      <Link to="/restaurant-owner/restaurants" className="btn btn-outline-primary">
                        Xem tất cả ({restaurants.length} nhà hàng)
                      </Link>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default RestaurantOwnerDashboardPage;

