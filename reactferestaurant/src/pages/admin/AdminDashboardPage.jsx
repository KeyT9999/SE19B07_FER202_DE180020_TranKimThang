/**
 * AdminDashboardPage Component
 * Admin dashboard with statistics and overview
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalBookings: 0,
    activeUsers: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [usersRes, restaurantsRes, bookingsRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/restaurants').catch(() => ({ data: [] })),
        api.get('/bookings').catch(() => ({ data: [] })),
      ]);

      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const restaurants = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

      setStats({
        totalUsers: users.length,
        totalRestaurants: restaurants.length,
        totalBookings: bookings.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Đang tải thống kê..." />;
  }

  return (
    <div className="admin-dashboard-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin">
            <i className="fas fa-tachometer-alt me-2"></i>
            Admin Dashboard
          </h1>
          <p className="page-subtitle-admin">Tổng quan hệ thống Book Eat</p>
        </div>

        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <div className="stat-icon-admin users">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="stat-value-admin">{stats.totalUsers}</h3>
                <p className="stat-label-admin">Tổng số người dùng</p>
                <Link to="/admin/users" className="stat-link-admin">
                  Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <div className="stat-icon-admin restaurants">
                  <i className="fas fa-utensils"></i>
                </div>
                <h3 className="stat-value-admin">{stats.totalRestaurants}</h3>
                <p className="stat-label-admin">Tổng số nhà hàng</p>
                <Link to="/admin/restaurants" className="stat-link-admin">
                  Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <div className="stat-icon-admin bookings">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3 className="stat-value-admin">{stats.totalBookings}</h3>
                <p className="stat-label-admin">Tổng số đặt bàn</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <div className="stat-icon-admin active">
                  <i className="fas fa-user-check"></i>
                </div>
                <h3 className="stat-value-admin">{stats.activeUsers}</h3>
                <p className="stat-label-admin">Người dùng hoạt động</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="quick-action-card-admin">
              <Card.Header className="card-header-admin">
                <i className="fas fa-bolt me-2"></i>
                Thao tác nhanh
              </Card.Header>
              <Card.Body>
                <div className="quick-actions-admin">
                  <Link to="/admin/users/new" className="quick-action-btn-admin">
                    <i className="fas fa-user-plus me-2"></i>
                    Thêm người dùng mới
                  </Link>
                  <Link to="/admin/users" className="quick-action-btn-admin">
                    <i className="fas fa-users-cog me-2"></i>
                    Quản lý người dùng
                  </Link>
                  <Link to="/admin/restaurants" className="quick-action-btn-admin">
                    <i className="fas fa-store me-2"></i>
                    Quản lý nhà hàng
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="info-card-admin">
              <Card.Header className="card-header-admin">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin hệ thống
              </Card.Header>
              <Card.Body>
                <div className="info-item-admin">
                  <span className="info-label-admin">Đặt bàn đang chờ:</span>
                  <Badge bg="warning" className="ms-2">{stats.pendingBookings}</Badge>
                </div>
                <div className="info-item-admin">
                  <span className="info-label-admin">Trạng thái hệ thống:</span>
                  <Badge bg="success" className="ms-2">Hoạt động bình thường</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboardPage;

