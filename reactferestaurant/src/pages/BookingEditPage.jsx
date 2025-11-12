/**
 * BookingEditPage Component
 * Edit existing booking
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getBookingDetails, updateBooking } from '../services/bookingService';
import api from '../services/api';
import Loading from '../components/common/Loading';
import './BookingEditPage.css';

function BookingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    bookingTime: '',
    numberOfGuests: '',
    note: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBooking();
  }, [id, isAuthenticated, navigate]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const bookingData = await getBookingDetails(id);
      setBooking(bookingData);
      
      // Set form data
      const bookingDate = new Date(bookingData.bookingTime);
      const dateStr = bookingDate.toISOString().split('T')[0];
      const timeStr = bookingDate.toTimeString().slice(0, 5);
      
      setFormData({
        bookingTime: `${dateStr}T${timeStr}`,
        numberOfGuests: bookingData.numberOfGuests || '',
        note: bookingData.note || '',
      });

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
    } catch (error) {
      console.error('Error loading booking:', error);
      setErrorWithTimeout('Không thể tải thông tin đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookingTime || !formData.numberOfGuests) {
      setErrorWithTimeout('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (parseInt(formData.numberOfGuests) < 1) {
      setErrorWithTimeout('Số khách phải lớn hơn 0.');
      return;
    }

    try {
      setSaving(true);
      
      const bookingDateTime = new Date(formData.bookingTime);
      
      await updateBooking(id, {
        bookingTime: bookingDateTime.toISOString(),
        numberOfGuests: parseInt(formData.numberOfGuests),
        note: formData.note,
      });

      setSuccessWithTimeout('Đã cập nhật đặt bàn thành công.');
      navigate(`/booking/${id}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      setErrorWithTimeout('Không thể cập nhật đặt bàn.');
    } finally {
      setSaving(false);
    }
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
          <Button variant="primary" onClick={() => navigate('/booking/my')}>
            Quay lại danh sách đặt bàn
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="booking-edit-page">
      <Container>
        <div className="page-header mb-4">
          <Button variant="link" onClick={() => navigate(`/booking/${id}`)} className="back-button">
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title">
            <i className="fas fa-edit me-2"></i>
            Chỉnh sửa đặt bàn
          </h1>
          {restaurant && (
            <p className="page-subtitle">
              {restaurant.restaurantName}
            </p>
          )}
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="form-card">
              <Card.Header className="card-header">
                <i className="fas fa-calendar-alt me-2"></i>
                Thông tin đặt bàn
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thời gian đặt bàn <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số khách <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </Form.Group>

                  <div className="form-actions">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/booking/${id}`)}
                      disabled={saving}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingEditPage;

