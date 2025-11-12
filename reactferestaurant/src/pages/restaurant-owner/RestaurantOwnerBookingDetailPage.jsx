/**
 * RestaurantOwnerBookingDetailPage Component
 * Detailed booking view for restaurant owners with management actions
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getBookingDetails, updateBooking } from '../../services/bookingService';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerBookingDetailPage.css';

function RestaurantOwnerBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [booking, setBooking] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [tables, setTables] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Load booking details
      const bookingData = await getBookingDetails(id);
      setBooking(bookingData);
      
      // Load restaurant
      if (bookingData.restaurantId) {
        try {
          const resRes = await api.get(`/restaurants/${bookingData.restaurantId}`);
          setRestaurant(resRes.data);
        } catch (e) {
          const allRes = await api.get('/restaurants');
          const found = Array.isArray(allRes.data) 
            ? allRes.data.find(r => r.restaurantId === bookingData.restaurantId)
            : null;
          if (found) setRestaurant(found);
        }
      }
      
      // Load customer
      if (bookingData.customerId) {
        try {
          const customerRes = await api.get(`/users/${bookingData.customerId}`);
          setCustomer(customerRes.data);
        } catch (e) {
          console.warn('Could not load customer data');
        }
      }
      
      // Load tables
      if (bookingData.tableIds && bookingData.tableIds.length > 0) {
        const tablePromises = bookingData.tableIds.map(tableId =>
          api.get(`/tables/${tableId}`).catch(() => null)
        );
        const tableResponses = await Promise.all(tablePromises);
        const validTables = tableResponses
          .filter(response => response && response.data)
          .map(response => response.data);
        setTables(validTables);
      }
      
      // Load services
      if (bookingData.serviceIds && bookingData.serviceIds.length > 0) {
        const servicePromises = bookingData.serviceIds.map(serviceId =>
          api.get(`/services/${serviceId}`).catch(() => null)
        );
        const serviceResponses = await Promise.all(servicePromises);
        const validServices = serviceResponses
          .filter(response => response && response.data)
          .map(response => response.data);
        setServices(validServices);
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
      setErrorWithTimeout('Không thể tải thông tin đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${newStatus === 'CONFIRMED' ? 'xác nhận' : newStatus === 'CANCELLED' ? 'hủy' : 'hoàn thành'} đặt bàn này?`)) {
      return;
    }

    try {
      setUpdating(true);
      await updateBooking(id, { status: newStatus });
      setSuccessWithTimeout(`Đã ${newStatus === 'CONFIRMED' ? 'xác nhận' : newStatus === 'CANCELLED' ? 'hủy' : 'hoàn thành'} đặt bàn thành công.`);
      await loadBookingDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setErrorWithTimeout('Không thể cập nhật trạng thái đặt bàn.');
    } finally {
      setUpdating(false);
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
          <Link to="/restaurant-owner/bookings">
            <Button variant="primary">Quay lại danh sách đặt bàn</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="restaurant-owner-booking-detail-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button
            variant="link"
            onClick={() => navigate('/restaurant-owner/bookings')}
            className="back-button-owner"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title-owner">
            <i className="fas fa-calendar-check me-2"></i>
            Chi tiết đặt bàn #{booking.bookingId || booking.id}
          </h1>
          <div className="status-display-owner">
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <Row>
          <Col lg={8}>
            {/* Customer Information */}
            {customer && (
              <Card className="info-card-owner mb-4">
                <Card.Header className="card-header-owner">
                  <i className="fas fa-user me-2"></i>
                  Thông tin khách hàng
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="detail-item-owner">
                        <i className="fas fa-user-circle me-2 text-primary"></i>
                        <div>
                          <strong>Họ tên</strong>
                          <p className="mb-0">{customer.fullName || customer.username}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item-owner">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        <div>
                          <strong>Email</strong>
                          <p className="mb-0">{customer.email}</p>
                        </div>
                      </div>
                    </Col>
                    {customer.phone && (
                      <Col md={6} className="mt-3">
                        <div className="detail-item-owner">
                          <i className="fas fa-phone me-2 text-primary"></i>
                          <div>
                            <strong>Số điện thoại</strong>
                            <p className="mb-0">{customer.phone}</p>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Booking Information */}
            <Card className="info-card-owner mb-4">
              <Card.Header className="card-header-owner">
                <i className="fas fa-calendar-alt me-2"></i>
                Thông tin đặt bàn
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="detail-item-owner">
                      <i className="fas fa-clock me-2 text-primary"></i>
                      <div>
                        <strong>Thời gian đặt bàn</strong>
                        <p className="mb-0">{formatDate(booking.bookingTime)}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item-owner">
                      <i className="fas fa-users me-2 text-primary"></i>
                      <div>
                        <strong>Số khách</strong>
                        <p className="mb-0">{booking.numberOfGuests} người</p>
                      </div>
                    </div>
                  </Col>
                  {booking.note && (
                    <Col md={12} className="mt-3">
                      <div className="detail-item-owner">
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
              <Card className="info-card-owner mb-4">
                <Card.Header className="card-header-owner">
                  <i className="fas fa-table me-2"></i>
                  Bàn đã đặt
                </Card.Header>
                <Card.Body>
                  <Row>
                    {tables.map((table) => (
                      <Col md={6} key={table.tableId || table.id} className="mb-3">
                        <div className="table-item-owner">
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
              <Card className="info-card-owner mb-4">
                <Card.Header className="card-header-owner">
                  <i className="fas fa-concierge-bell me-2"></i>
                  Dịch vụ đã chọn
                </Card.Header>
                <Card.Body>
                  <Row>
                    {services.map((service) => (
                      <Col md={6} key={service.serviceId || service.id} className="mb-3">
                        <div className="service-item-owner">
                          <h6>{service.name || service.serviceName}</h6>
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
            <Card className="summary-card-owner mb-4">
              <Card.Header className="card-header-owner">
                <i className="fas fa-receipt me-2"></i>
                Tóm tắt thanh toán
              </Card.Header>
              <Card.Body>
                <div className="summary-item-owner">
                  <span>Tiền cọc</span>
                  <strong>{formatCurrency(booking.depositAmount || 0)}</strong>
                </div>
                {services.length > 0 && (
                  <div className="summary-item-owner">
                    <span>Dịch vụ</span>
                    <strong>
                      {formatCurrency(
                        services.reduce((sum, s) => sum + (s.price || 0), 0)
                      )}
                    </strong>
                  </div>
                )}
                <hr />
                <div className="summary-item-owner total-owner">
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
            <Card className="actions-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-cog me-2"></i>
                Thao tác
              </Card.Header>
              <Card.Body>
                <div className="booking-actions-owner">
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        variant="success"
                        className="w-100 mb-2"
                        onClick={() => handleUpdateStatus('CONFIRMED')}
                        disabled={updating}
                      >
                        <i className="fas fa-check me-2"></i>
                        {updating ? 'Đang xử lý...' : 'Xác nhận đặt bàn'}
                      </Button>
                      <Button
                        variant="danger"
                        className="w-100 mb-2"
                        onClick={() => handleUpdateStatus('CANCELLED')}
                        disabled={updating}
                      >
                        <i className="fas fa-times me-2"></i>
                        {updating ? 'Đang xử lý...' : 'Hủy đặt bàn'}
                      </Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      variant="info"
                      className="w-100 mb-2"
                      onClick={() => handleUpdateStatus('COMPLETED')}
                      disabled={updating}
                    >
                      <i className="fas fa-check-double me-2"></i>
                      {updating ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
                    </Button>
                  )}
                  <Link to="/restaurant-owner/bookings" className="w-100 d-block">
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
    </div>
  );
}

export default RestaurantOwnerBookingDetailPage;

