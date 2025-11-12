/**
 * BookingListPage Component
 * Page displaying list of user's bookings
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import Loading from '../components/common/Loading';
import './BookingListPage.css';

function BookingListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout } = useApp();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, navigate, user]);

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Get bookings for current user
      const response = await api.get(`/bookings?customerId=${user.id}`);
      const bookingsData = response.data || [];
      
      // Get unique restaurant IDs
      const restaurantIds = [...new Set(bookingsData.map(b => b.restaurantId))];
      
      // Load restaurant data
      const restaurantPromises = restaurantIds.map(id => 
        api.get(`/restaurants/${id}`).catch(() => null)
      );
      const restaurantResponses = await Promise.all(restaurantPromises);
      
      const restaurantsMap = {};
      restaurantResponses.forEach((response, index) => {
        if (response && response.data) {
          restaurantsMap[restaurantIds[index]] = response.data;
        }
      });
      
      setRestaurants(restaurantsMap);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setErrorWithTimeout('Không thể tải danh sách đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { variant: 'warning', text: 'Chờ xác nhận' },
      CONFIRMED: { variant: 'success', text: 'Đã xác nhận' },
      CANCELLED: { variant: 'danger', text: 'Đã hủy' },
      COMPLETED: { variant: 'info', text: 'Hoàn thành' },
    };
    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="booking-list-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="page-header mb-4">
            <h1 className="page-title">
              <i className="fas fa-calendar-check me-2"></i>
              Đặt bàn của tôi
            </h1>
            <p className="page-subtitle">Quản lý và xem chi tiết các đặt bàn của bạn</p>
          </div>

          {bookings.length === 0 ? (
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5>Chưa có đặt bàn nào</h5>
                <p className="text-muted">Bạn chưa có đặt bàn nào. Hãy đặt bàn ngay!</p>
                <Link to="/restaurants">
                  <Button variant="primary">
                    <i className="fas fa-search me-2"></i>
                    Tìm nhà hàng
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {bookings.map((booking) => {
                const restaurant = restaurants[booking.restaurantId];
                return (
                  <Col key={booking.bookingId} xs={12} className="mb-4">
                    <Card className="ds-card booking-card">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <div className="booking-header mb-3">
                              <h5 className="booking-restaurant-name">
                                {restaurant?.restaurantName || `Nhà hàng #${booking.restaurantId}`}
                              </h5>
                              {getStatusBadge(booking.status)}
                            </div>
                            
                            <div className="booking-details">
                              <div className="booking-detail-item">
                                <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                <strong>Thời gian:</strong> {formatDate(booking.bookingTime)}
                              </div>
                              <div className="booking-detail-item">
                                <i className="fas fa-users me-2 text-primary"></i>
                                <strong>Số khách:</strong> {booking.numberOfGuests} người
                              </div>
                              {booking.depositAmount && (
                                <div className="booking-detail-item">
                                  <i className="fas fa-money-bill-wave me-2 text-primary"></i>
                                  <strong>Tiền cọc:</strong> {booking.depositAmount.toLocaleString('vi-VN')} VNĐ
                                </div>
                              )}
                              {booking.note && (
                                <div className="booking-detail-item">
                                  <i className="fas fa-sticky-note me-2 text-primary"></i>
                                  <strong>Ghi chú:</strong> {booking.note}
                                </div>
                              )}
                              <div className="booking-detail-item">
                                <i className="fas fa-clock me-2 text-primary"></i>
                                <strong>Ngày đặt:</strong> {formatDate(booking.createdAt)}
                              </div>
                            </div>
                          </Col>
                          <Col md={4} className="text-md-end">
                            <div className="booking-actions">
                              <Link to={`/booking/${booking.bookingId}`}>
                                <Button variant="outline-primary" className="w-100 mb-2">
                                  <i className="fas fa-eye me-2"></i>
                                  Xem chi tiết
                                </Button>
                              </Link>
                              {booking.status === 'PENDING' && (
                                <Button 
                                  variant="outline-danger" 
                                  className="w-100"
                                  onClick={() => {
                                    // TODO: Implement cancel booking
                                    alert('Tính năng hủy đặt bàn sẽ được triển khai');
                                  }}
                                >
                                  <i className="fas fa-times me-2"></i>
                                  Hủy đặt bàn
                                </Button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
}

export default BookingListPage;

