/**
 * RestaurantOwnerBookingsPage Component
 * Manage bookings for restaurant owner's restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerBookingsPage.css';

function RestaurantOwnerBookingsPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, restaurantFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurants
      const restaurantsRes = await api.get('/restaurants');
      const restaurantsData = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      const restaurantsMap = {};
      restaurantsData.forEach(r => {
        restaurantsMap[r.restaurantId] = r;
      });
      setRestaurants(restaurantsMap);
      
      // Load bookings
      const bookingsRes = await api.get('/bookings');
      const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      // TODO: Filter by owner's restaurants
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => {
        const restaurant = restaurants[booking.restaurantId];
        return (
          booking.bookingId?.toString().includes(search) ||
          restaurant?.restaurantName?.toLowerCase().includes(search) ||
          booking.note?.toLowerCase().includes(search)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Restaurant filter
    if (restaurantFilter !== 'all') {
      filtered = filtered.filter(booking => booking.restaurantId === parseInt(restaurantFilter));
    }

    setFilteredBookings(filtered);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b.bookingId === bookingId || b.id === bookingId);
      if (!booking) return;

      const existing = await api.get(`/bookings/${booking.id || bookingId}`);
      await api.put(`/bookings/${booking.id || bookingId}`, {
        ...existing.data,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      
      setSuccessWithTimeout('Đã cập nhật trạng thái đặt bàn thành công.');
      await loadData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setErrorWithTimeout('Không thể cập nhật trạng thái.');
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

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <Loading message="Đang tải danh sách đặt bàn..." />;
  }

  const restaurantOptions = Object.values(restaurants);

  return (
    <div className="restaurant-owner-bookings-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className="fas fa-calendar-check me-2"></i>
            Quản lý đặt bàn
          </h1>
          <p className="page-subtitle-owner">Quản lý tất cả đặt bàn tại nhà hàng của bạn</p>
        </div>

        {/* Filters */}
        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm theo mã đặt bàn, tên nhà hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="PENDING">Chờ xác nhận</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="CANCELLED">Đã hủy</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nhà hàng</Form.Label>
                  <Form.Select
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {restaurantOptions.map(restaurant => (
                      <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
                        {restaurant.restaurantName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Không tìm thấy đặt bàn nào.
          </Alert>
        ) : (
          <Row>
            {filteredBookings.map((booking) => {
              const restaurant = restaurants[booking.restaurantId];
              return (
                <Col md={6} lg={4} key={booking.bookingId || booking.id} className="mb-4">
                  <Card className="booking-card-owner">
                    <Card.Body>
                      <div className="booking-header-owner">
                        <div>
                          <h5 className="booking-id-owner">
                            #{booking.bookingId || booking.id}
                          </h5>
                          <p className="booking-restaurant-name-owner">
                            {restaurant?.restaurantName || `Nhà hàng #${booking.restaurantId}`}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="booking-info-owner">
                        <p className="mb-2">
                          <i className="fas fa-calendar-alt me-2 text-primary"></i>
                          <strong>Thời gian:</strong><br />
                          {formatDate(booking.bookingTime)}
                        </p>
                        <p className="mb-2">
                          <i className="fas fa-users me-2 text-primary"></i>
                          <strong>Số khách:</strong> {booking.numberOfGuests} người
                        </p>
                        {booking.depositAmount > 0 && (
                          <p className="mb-2">
                            <i className="fas fa-money-bill-wave me-2 text-success"></i>
                            <strong>Tiền cọc:</strong> {formatCurrency(booking.depositAmount)}
                          </p>
                        )}
                        {booking.note && (
                          <p className="mb-0 text-muted">
                            <i className="fas fa-sticky-note me-2"></i>
                            {booking.note}
                          </p>
                        )}
                      </div>
                      
                      <div className="booking-actions-owner">
                        {booking.status === 'PENDING' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleUpdateStatus(booking.bookingId || booking.id, 'CONFIRMED')}
                            >
                              <i className="fas fa-check me-1"></i>
                              Xác nhận
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleUpdateStatus(booking.bookingId || booking.id, 'CANCELLED')}
                            >
                              <i className="fas fa-times me-1"></i>
                              Hủy
                            </Button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleUpdateStatus(booking.bookingId || booking.id, 'COMPLETED')}
                          >
                            <i className="fas fa-check-double me-1"></i>
                            Hoàn thành
                          </Button>
                        )}
                        <Link to={`/booking/${booking.bookingId || booking.id}`}>
                          <Button variant="outline-primary" size="sm" className="ms-2">
                            <i className="fas fa-eye me-1"></i>
                            Chi tiết
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default RestaurantOwnerBookingsPage;

