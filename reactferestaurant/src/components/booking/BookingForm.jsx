/**
 * BookingForm Component
 * Form for creating a new booking
 */

import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaStickyNote } from 'react-icons/fa';
import { createBooking, checkAvailability } from '../../services/bookingService';
import { BOOKING_CONSTANTS, TIME_SLOTS } from '../../utils/constants';
import { isValidBookingDateTime, isValidGuestCount, isValidDeposit, isValidNote, getValidationError } from '../../utils/validators';
import { useApp } from '../../contexts/AppContext';
import './BookingForm.css';

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();

  // Get initial data from navigation state
  const restaurantId = location.state?.restaurantId;
  const restaurantName = location.state?.restaurantName;
  const preSelectedTables = location.state?.selectedTables || [];
  const preSelectedServices = location.state?.selectedServices || [];

  const [formData, setFormData] = useState({
    restaurantId: restaurantId || '',
    date: '',
    time: '',
    guests: '',
    tableIds: preSelectedTables || [],
    serviceIds: preSelectedServices ? preSelectedServices.map((s) => s.serviceId || s) : [],
    depositAmount: '',
    note: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  // Set minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate restaurant
    if (!formData.restaurantId) {
      newErrors.restaurantId = 'Vui lòng chọn nhà hàng';
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = getValidationError('date', formData.date);
    }

    // Validate time
    if (!formData.time) {
      newErrors.time = getValidationError('time', formData.time);
    }

    // Validate date and time together
    if (formData.date && formData.time) {
      if (!isValidBookingDateTime(formData.date, formData.time)) {
        newErrors.datetime = `Thời gian đặt bàn phải sau ${BOOKING_CONSTANTS.TIME_BUFFER_MINUTES} phút kể từ bây giờ`;
      }
    }

    // Validate guests
    if (!isValidGuestCount(formData.guests)) {
      newErrors.guests = getValidationError('guests', formData.guests);
    }

    // Validate deposit
    if (formData.depositAmount && !isValidDeposit(formData.depositAmount)) {
      newErrors.depositAmount = getValidationError('depositAmount', formData.depositAmount);
    }

    // Validate note
    if (formData.note && !isValidNote(formData.note)) {
      newErrors.note = getValidationError('note', formData.note);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckAvailability = async () => {
    if (!formData.restaurantId || !formData.date || !formData.time || !formData.guests) {
      setAvailabilityError('Vui lòng điền đầy đủ thông tin để kiểm tra');
      return;
    }

    try {
      setLoading(true);
      setAvailabilityError(null);
      const bookingTime = `${formData.date}T${formData.time}:00`;
      const result = await checkAvailability(
        parseInt(formData.restaurantId),
        bookingTime,
        parseInt(formData.guests),
        formData.tableIds.length > 0 ? formData.tableIds.join(',') : null
      );
      setAvailabilityChecked(true);
      if (!result.available) {
        setAvailabilityError(result.message || 'Không có bàn khả dụng cho thời gian này');
      }
    } catch (err) {
      console.error('Error checking availability:', err);
      setAvailabilityError('Có lỗi xảy ra khi kiểm tra tính khả dụng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!availabilityChecked) {
      setAvailabilityError('Vui lòng kiểm tra tính khả dụng trước khi đặt bàn');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        restaurantId: parseInt(formData.restaurantId),
        bookingDateTime: `${formData.date}T${formData.time}:00`,
        guestCount: parseInt(formData.guests),
        tableIds: formData.tableIds,
        serviceIds: formData.serviceIds,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : 0,
        note: formData.note || '',
        customerId: 1, // Default customer ID for JSON Server
      };

      await createBooking(bookingData);
      setSuccessWithTimeout('Đặt bàn thành công!');
      // Navigate to restaurants page since we don't have booking list page yet
      navigate('/restaurants');
    } catch (err) {
      console.error('Error creating booking:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.';
      setErrorWithTimeout(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <Card>
        <Card.Header>
          <h2 className="mb-0">Đặt bàn</h2>
          {restaurantName && <p className="text-muted mb-0">{restaurantName}</p>}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {!restaurantId && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Nhà hàng
                </Form.Label>
                <Form.Control
                  type="text"
                  name="restaurantId"
                  value={formData.restaurantId}
                  onChange={handleChange}
                  isInvalid={!!errors.restaurantId}
                  placeholder="Nhập ID nhà hàng"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.restaurantId}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Ngày đặt bàn
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={minDate}
                    isInvalid={!!errors.date || !!errors.datetime}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date || errors.datetime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaClock className="me-2" />
                    Giờ đặt bàn
                  </Form.Label>
                  <Form.Select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    isInvalid={!!errors.time || !!errors.datetime}
                    required
                  >
                    <option value="">Chọn giờ</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.text}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.time || errors.datetime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaUsers className="me-2" />
                Số khách
              </Form.Label>
              <Form.Control
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min={BOOKING_CONSTANTS.MIN_GUESTS}
                max={BOOKING_CONSTANTS.MAX_GUESTS}
                isInvalid={!!errors.guests}
                required
              />
              <Form.Text className="text-muted">
                Số khách từ {BOOKING_CONSTANTS.MIN_GUESTS} đến {BOOKING_CONSTANTS.MAX_GUESTS} người
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.guests}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaDollarSign className="me-2" />
                Số tiền đặt cọc (tùy chọn)
              </Form.Label>
              <Form.Control
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                min={BOOKING_CONSTANTS.MIN_DEPOSIT}
                step="1000"
                isInvalid={!!errors.depositAmount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.depositAmount}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaStickyNote className="me-2" />
                Ghi chú (tùy chọn)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleChange}
                maxLength={BOOKING_CONSTANTS.MAX_NOTE_LENGTH}
                isInvalid={!!errors.note}
                placeholder="Ghi chú đặc biệt cho nhà hàng..."
              />
              <Form.Text className="text-muted">
                {formData.note.length}/{BOOKING_CONSTANTS.MAX_NOTE_LENGTH} ký tự
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.note}
              </Form.Control.Feedback>
            </Form.Group>

            {formData.tableIds.length > 0 && (
              <Alert variant="info" className="mb-3">
                Đã chọn {formData.tableIds.length} bàn
              </Alert>
            )}

            {formData.serviceIds.length > 0 && (
              <Alert variant="info" className="mb-3">
                Đã chọn {formData.serviceIds.length} dịch vụ
              </Alert>
            )}

            <div className="availability-check mb-3">
              <Button
                type="button"
                variant="outline-primary"
                onClick={handleCheckAvailability}
                disabled={loading || !formData.restaurantId || !formData.date || !formData.time || !formData.guests}
              >
                Kiểm tra tính khả dụng
              </Button>
              {availabilityChecked && !availabilityError && (
                <Alert variant="success" className="mt-2">
                  Có bàn khả dụng cho thời gian này
                </Alert>
              )}
              {availabilityError && (
                <Alert variant="danger" className="mt-2">
                  {availabilityError}
                </Alert>
              )}
            </div>

            {errors.submit && (
              <Alert variant="danger" className="mb-3">
                {errors.submit}
              </Alert>
            )}

            <div className="form-actions">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !availabilityChecked || !!availabilityError}
              >
                {loading ? 'Đang xử lý...' : 'Đặt bàn'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BookingForm;

