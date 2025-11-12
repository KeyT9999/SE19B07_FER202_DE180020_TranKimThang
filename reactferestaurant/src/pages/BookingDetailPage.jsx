/**
 * BookingDetailPage Component
 * Displays detailed information about a specific booking
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getBookingDetails, cancelBooking } from '../services/bookingService';
import api from '../services/api';
import Loading from '../components/common/Loading';
import './BookingDetailPage.css';

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [booking, setBooking] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBookingDetails();
  }, [id, isAuthenticated, navigate]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Load booking details
      const bookingData = await getBookingDetails(id);
      setBooking(bookingData);
      
      // Load restaurant details
      if (bookingData.restaurantId) {
        try {
          const restaurantResponse = await api.get(`/restaurants/${bookingData.restaurantId}`);
          setRestaurant(restaurantResponse.data);
        } catch (error) {
          console.error('Error loading restaurant:', error);
        }
      }
      
      // Load table details
      if (bookingData.tableIds && bookingData.tableIds.length > 0) {
        try {
          const tablePromises = bookingData.tableIds.map(tableId =>
            api.get(`/tables/${tableId}`).catch(() => null)
          );
          const tableResponses = await Promise.all(tablePromises);
          const validTables = tableResponses
            .filter(response => response && response.data)
            .map(response => response.data);
          setTables(validTables);
        } catch (error) {
          console.error('Error loading tables:', error);
        }
      }
      
      // Load service details
      if (bookingData.serviceIds && bookingData.serviceIds.length > 0) {
        try {
          const servicePromises = bookingData.serviceIds.map(serviceId =>
            api.get(`/services/${serviceId}`).catch(() => null)
          );
          const serviceResponses = await Promise.all(servicePromises);
          const validServices = serviceResponses
            .filter(response => response && response.data)
            .map(response => response.data);
          setServices(validServices);
        } catch (error) {
          console.error('Error loading services:', error);
        }
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
      setErrorWithTimeout('Không thể tải thông tin đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelBooking(id);
      setSuccessWithTimeout('Đã hủy đặt bàn thành công.');
      // Reload booking details
      await loadBookingDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setErrorWithTimeout('Không thể hủy đặt bàn. Vui lòng thử lại.');
    } finally {
      setCancelling(false);
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
    return <Badge bg={statusInfo.variant} className="status-badge-large">{statusInfo.text}</Badge>;
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

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <Loading message="Đang tải thông tin đặt bàn..." />;
  }

  if (!booking) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Không tìm thấy đặt bàn</Alert.Heading>
          <p>Đặt bàn bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/booking/my">
            <Button variant="primary">Quay lại danh sách đặt bàn</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <main className="booking-detail-page">
      <Container>
        <div className="page-header-luxury mb-4">
          <Button
            variant="link"
            onClick={() => navigate('/booking/my')}
            className="back-button-luxury"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title-luxury">Chi tiết đặt bàn</h1>
          <div className="booking-id-luxury">Mã đặt bàn: #{booking.bookingId}</div>
        </div>

        <Row>
          <Col lg={8}>
            {/* Booking Status Card */}
            <Card className="booking-status-card-luxury mb-4">
              <Card.Body>
                <div className="status-header">
                  <h5 className="mb-0">Trạng thái đặt bàn</h5>
                  {getStatusBadge(booking.status)}
                </div>
              </Card.Body>
            </Card>

            {/* Restaurant Information */}
            {restaurant && (
              <Card className="info-card-luxury mb-4">
                <Card.Header className="card-header-luxury">
                  <i className="fas fa-utensils me-2"></i>
                  Thông tin nhà hàng
                </Card.Header>
                <Card.Body>
                  <h5 className="restaurant-name-luxury">{restaurant.restaurantName}</h5>
                  <div className="restaurant-info">
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
                    {restaurant.email && (
                      <p className="mb-0">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        {restaurant.email}
                      </p>
                    )}
                  </div>
                  <Link to={`/restaurants/${restaurant.restaurantId}`}>
                    <Button variant="outline-primary" size="sm" className="mt-3">
                      <i className="fas fa-external-link-alt me-2"></i>
                      Xem chi tiết nhà hàng
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            )}

            {/* Booking Details */}
            <Card className="info-card-luxury mb-4">
              <Card.Header className="card-header-luxury">
                <i className="fas fa-calendar-alt me-2"></i>
                Thông tin đặt bàn
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="detail-item-luxury">
                      <i className="fas fa-clock me-2 text-primary"></i>
                      <div>
                        <strong>Thời gian đặt bàn</strong>
                        <p className="mb-0">{formatDate(booking.bookingTime)}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item-luxury">
                      <i className="fas fa-users me-2 text-primary"></i>
                      <div>
                        <strong>Số khách</strong>
                        <p className="mb-0">{booking.numberOfGuests} người</p>
                      </div>
                    </div>
                  </Col>
                  {booking.note && (
                    <Col md={12} className="mt-3">
                      <div className="detail-item-luxury">
                        <i className="fas fa-sticky-note me-2 text-primary"></i>
                        <div>
                          <strong>Ghi chú</strong>
                          <p className="mb-0">{booking.note}</p>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>

            {/* Tables */}
            {tables.length > 0 && (
              <Card className="info-card-luxury mb-4">
                <Card.Header className="card-header-luxury">
                  <i className="fas fa-table me-2"></i>
                  Bàn đã đặt
                </Card.Header>
                <Card.Body>
                  <Row>
                    {tables.map((table) => (
                      <Col md={6} key={table.tableId} className="mb-3">
                        <div className="table-item-luxury">
                          <h6>{table.tableName}</h6>
                          <p className="mb-1">
                            <i className="fas fa-chair me-2"></i>
                            Sức chứa: {table.capacity} người
                          </p>
                          {table.depositAmount > 0 && (
                            <p className="mb-0 text-muted">
                              Đặt cọc: {formatCurrency(table.depositAmount)}
                            </p>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Services */}
            {services.length > 0 && (
              <Card className="info-card-luxury mb-4">
                <Card.Header className="card-header-luxury">
                  <i className="fas fa-concierge-bell me-2"></i>
                  Dịch vụ đã chọn
                </Card.Header>
                <Card.Body>
                  <Row>
                    {services.map((service) => (
                      <Col md={6} key={service.serviceId} className="mb-3">
                        <div className="service-item-luxury">
                          <h6>{service.serviceName}</h6>
                          {service.description && (
                            <p className="mb-1 text-muted">{service.description}</p>
                          )}
                          {service.price > 0 && (
                            <p className="mb-0">
                              <strong>Giá: {formatCurrency(service.price)}</strong>
                            </p>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            {/* Payment Summary */}
            <Card className="summary-card-luxury mb-4">
              <Card.Header className="card-header-luxury">
                <i className="fas fa-receipt me-2"></i>
                Tóm tắt thanh toán
              </Card.Header>
              <Card.Body>
                <div className="summary-item-luxury">
                  <span>Tiền cọc</span>
                  <strong>{formatCurrency(booking.depositAmount || 0)}</strong>
                </div>
                {services.length > 0 && (
                  <div className="summary-item-luxury">
                    <span>Dịch vụ</span>
                    <strong>
                      {formatCurrency(
                        services.reduce((sum, s) => sum + (s.price || 0), 0)
                      )}
                    </strong>
                  </div>
                )}
                <hr />
                <div className="summary-item-luxury total-luxury">
                  <span>Tổng cộng</span>
                  <strong>
                    {formatCurrency(
                      (booking.depositAmount || 0) +
                      services.reduce((sum, s) => sum + (s.price || 0), 0)
                    )}
                  </strong>
                </div>
              </Card.Body>
            </Card>

            {/* Actions */}
            <Card className="actions-card-luxury">
              <Card.Body>
                <div className="booking-actions-luxury">
                  {booking.status === 'PENDING' && (
                    <Button
                      variant="danger"
                      className="w-100 mb-2"
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                    >
                      <i className="fas fa-times me-2"></i>
                      {cancelling ? 'Đang hủy...' : 'Hủy đặt bàn'}
                    </Button>
                  )}
                  {booking.status === 'PENDING' && (
                    <Link to={`/booking/${id}/edit`} className="w-100 d-block">
                      <Button variant="outline-primary" className="w-100 mb-2">
                        <i className="fas fa-edit me-2"></i>
                        Chỉnh sửa đặt bàn
                      </Button>
                    </Link>
                  )}
                  <Link to="/booking/my" className="w-100 d-block">
                    <Button variant="outline-secondary" className="w-100">
                      <i className="fas fa-list me-2"></i>
                      Danh sách đặt bàn
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default BookingDetailPage;

