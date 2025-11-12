/**
 * PaymentResultPage Component
 * Luxury payment result page with animations and detailed booking info
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaCheckCircle, FaTimesCircle, FaCalendarCheck, FaHome, FaRedo,
  FaClock, FaUsers, FaMapMarkerAlt, FaPhone, FaUtensils, FaReceipt,
  FaDownload, FaShareAlt, FaQrcode
} from 'react-icons/fa';
import { getBookingDetails } from '../services/bookingService';
import { getRestaurantById } from '../services/restaurantService';
import { formatCurrency } from '../utils/formatters';
import Loading from '../components/common/Loading';
import './PaymentResultPage.css';

function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const isSuccess = status === 'success';

  const [booking, setBooking] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSuccess && bookingId) {
      loadBookingDetails();
    }
  }, [isSuccess, bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingData = await getBookingDetails(bookingId);
      setBooking(bookingData);
      
      if (bookingData.restaurantId) {
        try {
          const restaurantData = await getRestaurantById(bookingData.restaurantId);
          setRestaurant(restaurantData);
        } catch (err) {
          console.error('Error loading restaurant:', err);
        }
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
      // Don't show error, just continue without booking details
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading message="Đang tải thông tin đặt bàn..." />;
  }

  return (
    <main className={`payment-result-page luxury ${isSuccess ? 'success' : 'error'}`}>
      {/* Background Animation */}
      <div className="payment-result-background">
        <div className="confetti-container">
          {isSuccess && Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][Math.floor(Math.random() * 5)]
            }}></div>
          ))}
        </div>
      </div>

      <Container>
        <div className="payment-result-container">
          {/* Success State */}
          {isSuccess ? (
            <div className="payment-success-content">
              {/* Success Icon with Animation */}
              <div className="success-icon-wrapper">
                <div className="success-icon-circle">
                  <div className="success-icon-circle-inner">
                    <FaCheckCircle className="success-icon" />
                  </div>
                  <div className="success-ripple"></div>
                  <div className="success-ripple delay-1"></div>
                  <div className="success-ripple delay-2"></div>
                </div>
              </div>

              {/* Success Title */}
              <h1 className="payment-success-title">
                Thanh toán thành công!
              </h1>
              <p className="payment-success-subtitle">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
              </p>

              {/* Booking Details Card */}
              <Card className="booking-details-card">
                <Card.Body>
                  <div className="booking-details-header">
                    <div className="booking-id-badge">
                      <FaReceipt className="me-2" />
                      Mã đặt bàn
                    </div>
                    <div className="booking-id-value">
                      #{bookingId || 'N/A'}
                    </div>
                  </div>

                  {booking && (
                    <div className="booking-info-section">
                      {restaurant && (
                        <div className="booking-info-item">
                          <div className="booking-info-icon">
                            <FaUtensils />
                          </div>
                          <div className="booking-info-content">
                            <div className="booking-info-label">Nhà hàng</div>
                            <div className="booking-info-value">{restaurant.restaurantName}</div>
                            <div className="booking-info-address">
                              <FaMapMarkerAlt className="me-1" />
                              {restaurant.address}
                            </div>
                            {restaurant.phone && (
                              <div className="booking-info-phone">
                                <FaPhone className="me-1" />
                                {restaurant.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {booking.bookingTime && (
                        <div className="booking-info-item">
                          <div className="booking-info-icon">
                            <FaClock />
                          </div>
                          <div className="booking-info-content">
                            <div className="booking-info-label">Thời gian</div>
                            <div className="booking-info-value">{formatDate(booking.bookingTime)}</div>
                          </div>
                        </div>
                      )}

                      {booking.numberOfGuests && (
                        <div className="booking-info-item">
                          <div className="booking-info-icon">
                            <FaUsers />
                          </div>
                          <div className="booking-info-content">
                            <div className="booking-info-label">Số khách</div>
                            <div className="booking-info-value">{booking.numberOfGuests} người</div>
                          </div>
                        </div>
                      )}

                      {booking.depositAmount > 0 && (
                        <div className="booking-info-item">
                          <div className="booking-info-icon">
                            <FaReceipt />
                          </div>
                          <div className="booking-info-content">
                            <div className="booking-info-label">Tiền đã thanh toán</div>
                            <div className="booking-info-value amount">
                              {formatCurrency(booking.depositAmount)}
                            </div>
                          </div>
                        </div>
                      )}

                      {amount && !booking?.depositAmount && (
                        <div className="booking-info-item">
                          <div className="booking-info-icon">
                            <FaReceipt />
                          </div>
                          <div className="booking-info-content">
                            <div className="booking-info-label">Tổng tiền</div>
                            <div className="booking-info-value amount">
                              {formatCurrency(parseFloat(amount))}
                            </div>
                          </div>
                        </div>
                      )}

                      {booking.status && (
                        <div className="booking-status-badge">
                          <Badge 
                            bg={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'PENDING' ? 'warning' : 'secondary'}
                            className="status-badge-large"
                          >
                            {booking.status === 'CONFIRMED' && 'Đã xác nhận'}
                            {booking.status === 'PENDING' && 'Chờ xác nhận'}
                            {booking.status === 'CANCELLED' && 'Đã hủy'}
                            {!['CONFIRMED', 'PENDING', 'CANCELLED'].includes(booking.status) && booking.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {!booking && bookingId && (
                    <div className="booking-id-display">
                      <div className="booking-id-large">#{bookingId}</div>
                      <p className="booking-id-note">
                        Vui lòng lưu mã đặt bàn này để tra cứu sau
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Success Message */}
              <div className="success-message-box">
                <p className="success-message">
                  <i className="fas fa-check-circle me-2"></i>
                  Đặt bàn của bạn đã được xác nhận thành công. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="payment-result-actions luxury">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/booking/my`)}
                  className="action-button primary"
                >
                  <FaCalendarCheck className="me-2" />
                  Xem đặt bàn của tôi
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => navigate('/restaurants')}
                  className="action-button secondary"
                >
                  <FaUtensils className="me-2" />
                  Đặt bàn khác
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => navigate('/')}
                  className="action-button tertiary"
                >
                  <FaHome className="me-2" />
                  Về trang chủ
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="additional-actions">
                <Button
                  variant="link"
                  className="action-link"
                  onClick={() => {
                    // TODO: Implement download receipt
                    alert('Tính năng tải hóa đơn sẽ được triển khai');
                  }}
                >
                  <FaDownload className="me-2" />
                  Tải hóa đơn
                </Button>
                <Button
                  variant="link"
                  className="action-link"
                  onClick={() => {
                    // TODO: Implement share
                    if (navigator.share) {
                      navigator.share({
                        title: 'Đặt bàn thành công',
                        text: `Tôi đã đặt bàn thành công với mã #${bookingId}`,
                      });
                    } else {
                      alert('Tính năng chia sẻ sẽ được triển khai');
                    }
                  }}
                >
                  <FaShareAlt className="me-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          ) : (
            /* Error State */
            <div className="payment-error-content">
              <div className="error-icon-wrapper">
                <FaTimesCircle className="error-icon" />
              </div>
              <h1 className="payment-error-title">
                Thanh toán thất bại
              </h1>
              <p className="payment-error-message">
                Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
              <Card className="error-details-card">
                <Card.Body>
                  <p className="error-details">
                    Nếu bạn đã thanh toán nhưng nhận được thông báo này, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.
                  </p>
                </Card.Body>
              </Card>
              <div className="payment-result-actions luxury">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/payment/form?bookingId=${bookingId}`)}
                  className="action-button primary"
                >
                  <FaRedo className="me-2" />
                  Thử lại thanh toán
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => navigate('/')}
                  className="action-button secondary"
                >
                  <FaHome className="me-2" />
                  Về trang chủ
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

export default PaymentResultPage;
