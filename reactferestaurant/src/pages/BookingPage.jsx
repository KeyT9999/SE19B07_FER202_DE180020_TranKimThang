/**
 * BookingPage Component
 * Luxury multi-step booking page with comprehensive logic
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { 
  FaArrowLeft, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaStickyNote,
  FaCheck, FaChevronRight, FaChevronLeft, FaUtensils, FaMapMarkerAlt, FaPhone,
  FaStar, FaTable, FaConciergeBell, FaCreditCard
} from 'react-icons/fa';
import { getRestaurantById, getRestaurantTables, getRestaurantServices } from '../services/restaurantService';
import { createBooking, checkAvailability } from '../services/bookingService';
import { BOOKING_CONSTANTS, TIME_SLOTS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import './BookingPage.css';

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const { user, isAuthenticated } = useAuth();

  // Get initial data from navigation state
  const restaurantId = location.state?.restaurantId;
  const preSelectedTables = location.state?.selectedTables || [];
  const preSelectedServices = location.state?.selectedServices || [];

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [services, setServices] = useState([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    restaurantId: restaurantId || '',
    date: '',
    time: '',
    guests: '',
    selectedTableIds: preSelectedTables.map(t => typeof t === 'object' ? t.tableId : t),
    selectedServiceIds: preSelectedServices.map(s => typeof s === 'object' ? s.serviceId : s),
    depositAmount: '',
    note: '',
  });

  const [errors, setErrors] = useState({});

  // Load restaurant data
  useEffect(() => {
    if (!restaurantId) {
      setErrorWithTimeout('Vui lòng chọn nhà hàng trước khi đặt bàn');
      navigate('/restaurants');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        console.log('[BookingPage] Loading data for restaurant:', restaurantId);
        
        const [restaurantData, tablesData, servicesData] = await Promise.all([
          getRestaurantById(restaurantId),
          getRestaurantTables(restaurantId),
          getRestaurantServices(restaurantId),
        ]);
        
        console.log('[BookingPage] Restaurant data:', restaurantData);
        console.log('[BookingPage] Tables data:', tablesData);
        console.log('[BookingPage] Services data:', servicesData);
        
        // Ensure tables is an array
        const tablesArray = Array.isArray(tablesData) ? tablesData : [];
        const servicesArray = Array.isArray(servicesData) ? servicesData : [];
        
        console.log('[BookingPage] Tables array length:', tablesArray.length);
        console.log('[BookingPage] Services array length:', servicesArray.length);
        
        setRestaurant(restaurantData);
        setTables(tablesArray);
        setServices(servicesArray);
      } catch (error) {
        console.error('[BookingPage] Error loading data:', error);
        console.error('[BookingPage] Error details:', {
          message: error.message,
          response: error.response,
          request: error.request
        });
        setErrorWithTimeout('Không thể tải thông tin nhà hàng');
        // Don't navigate away, just show error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantId, navigate, setErrorWithTimeout]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  // Calculate totals
  const calculateTotals = () => {
    const selectedTablesData = tables.filter(t => formData.selectedTableIds.includes(t.tableId));
    const selectedServicesData = services.filter(s => formData.selectedServiceIds.includes(s.serviceId));
    
    const tablesDeposit = selectedTablesData.reduce((sum, table) => sum + (table.depositAmount || 0), 0);
    const servicesTotal = selectedServicesData.reduce((sum, service) => sum + (service.price || 0), 0);
    const customDeposit = parseFloat(formData.depositAmount) || 0;
    
    const totalDeposit = tablesDeposit + customDeposit;
    const totalAmount = totalDeposit + servicesTotal;
    
    return {
      tablesDeposit,
      servicesTotal,
      customDeposit,
      totalDeposit,
      totalAmount,
    };
  };

  const totals = calculateTotals();

  // Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.date) {
        newErrors.date = 'Vui lòng chọn ngày';
      } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.date = 'Ngày không thể trong quá khứ';
        }
      }

      if (!formData.time) {
        newErrors.time = 'Vui lòng chọn giờ';
      }

      if (!formData.guests) {
        newErrors.guests = 'Vui lòng nhập số khách';
      } else {
        const guests = parseInt(formData.guests);
        if (guests < BOOKING_CONSTANTS.MIN_GUESTS || guests > BOOKING_CONSTANTS.MAX_GUESTS) {
          newErrors.guests = `Số khách phải từ ${BOOKING_CONSTANTS.MIN_GUESTS} đến ${BOOKING_CONSTANTS.MAX_GUESTS} người`;
        }
      }

      // Check date and time together
      if (formData.date && formData.time) {
        const bookingDateTime = new Date(`${formData.date}T${formData.time}:00`);
        const now = new Date();
        const bufferMinutes = BOOKING_CONSTANTS.TIME_BUFFER_MINUTES;
        const minDateTime = new Date(now.getTime() + bufferMinutes * 60000);
        
        if (bookingDateTime < minDateTime) {
          newErrors.datetime = `Thời gian đặt bàn phải sau ${bufferMinutes} phút kể từ bây giờ`;
        }
      }
    }

    if (step === 2) {
      // If no tables available, allow to proceed (system will auto-assign)
      if (tables.length === 0) {
        // No tables defined, allow to proceed
        return true;
      }
      
      if (formData.selectedTableIds.length === 0) {
        // Check if we have enough capacity without specific tables
        const totalCapacity = tables.reduce((sum, table) => sum + (table.capacity || 0), 0);
        if (totalCapacity < parseInt(formData.guests)) {
          newErrors.tables = 'Không đủ chỗ. Vui lòng chọn bàn phù hợp';
        }
      } else {
        // Check if selected tables have enough capacity
        const selectedTablesData = tables.filter(t => formData.selectedTableIds.includes(t.tableId));
        const totalCapacity = selectedTablesData.reduce((sum, table) => sum + (table.capacity || 0), 0);
        if (totalCapacity < parseInt(formData.guests)) {
          newErrors.tables = 'Bàn đã chọn không đủ chỗ cho số khách';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        // Check availability before moving to step 2
        handleCheckAvailability().then(() => {
          if (availabilityChecked && !availabilityError) {
            setCurrentStep(2);
          }
        });
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.time || !formData.guests) {
      setAvailabilityError('Vui lòng điền đầy đủ thông tin');
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
        formData.selectedTableIds.length > 0 ? formData.selectedTableIds.join(',') : null
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

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    if (!availabilityChecked || availabilityError) {
      setErrorWithTimeout('Vui lòng kiểm tra tính khả dụng trước khi đặt bàn');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        restaurantId: parseInt(formData.restaurantId),
        bookingDateTime: `${formData.date}T${formData.time}:00`,
        guestCount: parseInt(formData.guests),
        tableIds: formData.selectedTableIds,
        serviceIds: formData.selectedServiceIds,
        depositAmount: totals.totalDeposit,
        note: formData.note || '',
        customerId: user?.id || 1,
      };

      const booking = await createBooking(bookingData);
      setSuccessWithTimeout('Đặt bàn thành công!');
      
      // Navigate to payment or booking list
      navigate(`/payment/form?bookingId=${booking.bookingId || booking.id}&amount=${totals.totalAmount}`);
    } catch (err) {
      console.error('Error creating booking:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.';
      setErrorWithTimeout(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTableToggle = (tableId) => {
    setFormData(prev => {
      const isSelected = prev.selectedTableIds.includes(tableId);
      return {
        ...prev,
        selectedTableIds: isSelected
          ? prev.selectedTableIds.filter(id => id !== tableId)
          : [...prev.selectedTableIds, tableId],
      };
    });
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const isSelected = prev.selectedServiceIds.includes(serviceId);
      return {
        ...prev,
        selectedServiceIds: isSelected
          ? prev.selectedServiceIds.filter(id => id !== serviceId)
          : [...prev.selectedServiceIds, serviceId],
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading && !restaurant) {
    return <Loading message="Đang tải thông tin..." />;
  }

  if (!restaurant) {
    return null;
  }

  const minDate = new Date().toISOString().split('T')[0];
  const selectedTablesData = tables.filter(t => formData.selectedTableIds.includes(t.tableId));
  const selectedServicesData = services.filter(s => formData.selectedServiceIds.includes(s.serviceId));

  return (
    <div className="booking-page luxury">
      {/* Header */}
      <div className="booking-header">
        <Container>
          <Button
            variant="outline-light"
            className="back-button"
            onClick={() => navigate(`/restaurants/${restaurantId}`)}
          >
            <FaArrowLeft className="me-2" />
            Quay lại
          </Button>
          <div className="booking-header-content">
            <h1 className="booking-title">Đặt bàn</h1>
            <div className="restaurant-info-header">
              <h3>{restaurant.restaurantName}</h3>
              <div className="restaurant-meta">
                <Badge bg="light" text="dark" className="me-2">
                  <FaUtensils className="me-1" />
                  {restaurant.cuisineType}
                </Badge>
                <div className="rating-badge">
                  <FaStar className="text-warning" />
                  <span>{restaurant.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="booking-container">
        <Row>
          {/* Main Form */}
          <Col lg={8}>
            <Card className="booking-form-card">
              <Card.Body>
                {/* Progress Steps */}
                <div className="booking-steps">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                      <div className="step-number">
                        {currentStep > step ? <FaCheck /> : step}
                      </div>
                      <div className="step-label">
                        {step === 1 && 'Thông tin'}
                        {step === 2 && 'Chọn bàn'}
                        {step === 3 && 'Dịch vụ'}
                        {step === 4 && 'Xác nhận'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="step-content">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="step-panel">
                      <h3 className="step-title">
                        <FaCalendarAlt className="me-2" />
                        Thông tin đặt bàn
                      </h3>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>
                              <FaCalendarAlt className="me-2" />
                              Ngày đặt bàn <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              min={minDate}
                              isInvalid={!!errors.date || !!errors.datetime}
                              className="form-control-luxury"
                            />
                            {errors.date && (
                              <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            )}
                            {errors.datetime && (
                              <Form.Control.Feedback type="invalid">{errors.datetime}</Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>
                              <FaClock className="me-2" />
                              Giờ đặt bàn <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              isInvalid={!!errors.time}
                              className="form-control-luxury"
                            >
                              <option value="">Chọn giờ</option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.text}
                                </option>
                              ))}
                            </Form.Select>
                            {errors.time && (
                              <Form.Control.Feedback type="invalid">{errors.time}</Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FaUsers className="me-2" />
                          Số khách <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          min={BOOKING_CONSTANTS.MIN_GUESTS}
                          max={BOOKING_CONSTANTS.MAX_GUESTS}
                          isInvalid={!!errors.guests}
                          className="form-control-luxury"
                        />
                        <Form.Text className="text-muted">
                          Từ {BOOKING_CONSTANTS.MIN_GUESTS} đến {BOOKING_CONSTANTS.MAX_GUESTS} người
                        </Form.Text>
                        {errors.guests && (
                          <Form.Control.Feedback type="invalid">{errors.guests}</Form.Control.Feedback>
                        )}
                      </Form.Group>

                      {formData.date && formData.time && formData.guests && (
                        <div className="availability-section">
                          <Button
                            variant="outline-primary"
                            onClick={handleCheckAvailability}
                            disabled={loading}
                            className="w-100 mb-3"
                          >
                            {loading ? 'Đang kiểm tra...' : 'Kiểm tra tính khả dụng'}
                          </Button>
                          {availabilityChecked && !availabilityError && (
                            <Alert variant="success">
                              <FaCheck className="me-2" />
                              Có bàn khả dụng cho thời gian này
                            </Alert>
                          )}
                          {availabilityError && (
                            <Alert variant="danger">{availabilityError}</Alert>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Select Tables */}
                  {currentStep === 2 && (
                    <div className="step-panel">
                      <h3 className="step-title">
                        <FaTable className="me-2" />
                        Chọn bàn
                      </h3>
                      <p className="step-description">
                        Chọn bàn phù hợp với số khách ({formData.guests} người)
                      </p>

                      {loading ? (
                        <Loading message="Đang tải danh sách bàn..." />
                      ) : tables.length === 0 ? (
                        <Alert variant="info">
                          <strong>Nhà hàng chưa có thông tin bàn</strong>
                          <p className="mb-0 mt-2">
                            Bạn có thể bỏ qua bước này. Hệ thống sẽ tự động phân bàn phù hợp khi bạn xác nhận đặt bàn.
                          </p>
                        </Alert>
                      ) : (
                        <div className="tables-grid">
                          {tables.map((table) => {
                            const isSelected = formData.selectedTableIds.includes(table.tableId);
                            const isAvailable = table.status === 'AVAILABLE';
                            const capacityMatch = table.capacity >= parseInt(formData.guests);
                            
                            return (
                              <Card
                                key={table.tableId}
                                className={`table-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                                onClick={() => isAvailable && handleTableToggle(table.tableId)}
                              >
                                <Card.Body>
                                  <div className="table-header">
                                    <h5>{table.tableName}</h5>
                                    {isSelected && <FaCheck className="check-icon" />}
                                  </div>
                                  <div className="table-info">
                                    <div className="table-capacity">
                                      <FaUsers className="me-2" />
                                      {table.capacity} người
                                    </div>
                                    {table.depositAmount > 0 && (
                                      <div className="table-deposit">
                                        <FaDollarSign className="me-2" />
                                        {formatCurrency(table.depositAmount)}
                                      </div>
                                    )}
                                  </div>
                                  {!capacityMatch && (
                                    <Badge bg="warning" className="mt-2">
                                      Không đủ chỗ
                                    </Badge>
                                  )}
                                </Card.Body>
                              </Card>
                            );
                          })}
                        </div>
                      )}

                      {errors.tables && (
                        <Alert variant="danger" className="mt-3">{errors.tables}</Alert>
                      )}

                      {formData.selectedTableIds.length === 0 && tables.length > 0 && (
                        <Alert variant="info" className="mt-3">
                          <i className="fas fa-info-circle me-2"></i>
                          Bạn có thể bỏ qua bước này. Hệ thống sẽ tự động phân bàn phù hợp.
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* Step 3: Select Services */}
                  {currentStep === 3 && (
                    <div className="step-panel">
                      <h3 className="step-title">
                        <FaConciergeBell className="me-2" />
                        Dịch vụ bổ sung (Tùy chọn)
                      </h3>
                      <p className="step-description">
                        Chọn các dịch vụ bạn muốn sử dụng
                      </p>

                      {services.length === 0 ? (
                        <Alert variant="info">Nhà hàng chưa có dịch vụ bổ sung</Alert>
                      ) : (
                        <div className="services-list">
                          {services.map((service) => {
                            const isSelected = formData.selectedServiceIds.includes(service.serviceId);
                            
                            return (
                              <Card
                                key={service.serviceId}
                                className={`service-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleServiceToggle(service.serviceId)}
                              >
                                <Card.Body>
                                  <div className="service-content">
                                    <div>
                                      <h5>{service.name}</h5>
                                      {service.category && (
                                        <Badge bg="secondary" className="me-2">{service.category}</Badge>
                                      )}
                                      {service.description && (
                                        <p className="service-description">{service.description}</p>
                                      )}
                                    </div>
                                    <div className="service-price">
                                      {isSelected && <FaCheck className="check-icon me-2" />}
                                      <strong>{formatCurrency(service.price)}</strong>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <div className="step-panel">
                      <h3 className="step-title">
                        <FaCheck className="me-2" />
                        Xác nhận đặt bàn
                      </h3>

                      <div className="confirmation-details">
                        <div className="detail-section">
                          <h5>Thông tin đặt bàn</h5>
                          <div className="detail-item">
                            <FaCalendarAlt className="me-2" />
                            <span>{new Date(`${formData.date}T${formData.time}:00`).toLocaleString('vi-VN')}</span>
                          </div>
                          <div className="detail-item">
                            <FaUsers className="me-2" />
                            <span>{formData.guests} người</span>
                          </div>
                        </div>

                        {selectedTablesData.length > 0 && (
                          <div className="detail-section">
                            <h5>Bàn đã chọn</h5>
                            {selectedTablesData.map((table) => (
                              <div key={table.tableId} className="detail-item">
                                <FaTable className="me-2" />
                                <span>{table.tableName} ({table.capacity} người)</span>
                                {table.depositAmount > 0 && (
                                  <span className="ms-auto">{formatCurrency(table.depositAmount)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedServicesData.length > 0 && (
                          <div className="detail-section">
                            <h5>Dịch vụ đã chọn</h5>
                            {selectedServicesData.map((service) => (
                              <div key={service.serviceId} className="detail-item">
                                <FaConciergeBell className="me-2" />
                                <span>{service.name}</span>
                                <span className="ms-auto">{formatCurrency(service.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <Form.Group className="mb-4">
                          <Form.Label>
                            <FaStickyNote className="me-2" />
                            Ghi chú (Tùy chọn)
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            maxLength={BOOKING_CONSTANTS.MAX_NOTE_LENGTH}
                            placeholder="Ghi chú đặc biệt cho nhà hàng..."
                            className="form-control-luxury"
                          />
                          <Form.Text className="text-muted">
                            {formData.note.length}/{BOOKING_CONSTANTS.MAX_NOTE_LENGTH} ký tự
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="step-navigation">
                  {currentStep > 1 && (
                    <Button variant="outline-secondary" onClick={handleBack}>
                      <FaChevronLeft className="me-2" />
                      Quay lại
                    </Button>
                  )}
                  <div className="ms-auto">
                    {currentStep < 4 ? (
                      <Button variant="primary" onClick={handleNext} disabled={loading}>
                        Tiếp theo
                        <FaChevronRight className="ms-2" />
                      </Button>
                    ) : (
                      <Button variant="primary" size="lg" onClick={handleSubmit} disabled={loading || !availabilityChecked || !!availabilityError}>
                        <FaCreditCard className="me-2" />
                        {loading ? 'Đang xử lý...' : 'Xác nhận và thanh toán'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Summary Sidebar */}
          <Col lg={4}>
            <Card className="booking-summary-card sticky-top">
              <Card.Header>
                <h4 className="mb-0">Tóm tắt đặt bàn</h4>
              </Card.Header>
              <Card.Body>
                <div className="summary-restaurant">
                  <img
                    src={restaurant.mainImageUrl || 'https://via.placeholder.com/300x200'}
                    alt={restaurant.restaurantName}
                    className="summary-image"
                  />
                  <h5 className="mt-3">{restaurant.restaurantName}</h5>
                  <div className="restaurant-location">
                    <FaMapMarkerAlt className="me-2" />
                    {restaurant.address}
                  </div>
                  <div className="restaurant-phone">
                    <FaPhone className="me-2" />
                    {restaurant.phone}
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-details">
                  {formData.date && formData.time && (
                    <div className="summary-item">
                      <div className="summary-label">Thời gian</div>
                      <div className="summary-value">
                        {new Date(`${formData.date}T${formData.time}:00`).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        <br />
                        {TIME_SLOTS.find(s => s.value === formData.time)?.text}
                      </div>
                    </div>
                  )}

                  {formData.guests && (
                    <div className="summary-item">
                      <div className="summary-label">Số khách</div>
                      <div className="summary-value">{formData.guests} người</div>
                    </div>
                  )}

                  {selectedTablesData.length > 0 && (
                    <div className="summary-item">
                      <div className="summary-label">Bàn đã chọn</div>
                      <div className="summary-value">
                        {selectedTablesData.map(t => t.tableName).join(', ')}
                      </div>
                    </div>
                  )}

                  {selectedServicesData.length > 0 && (
                    <div className="summary-item">
                      <div className="summary-label">Dịch vụ</div>
                      <div className="summary-value">
                        {selectedServicesData.length} dịch vụ
                      </div>
                    </div>
                  )}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-totals">
                  {totals.tablesDeposit > 0 && (
                    <div className="total-item">
                      <span>Tiền cọc bàn</span>
                      <span>{formatCurrency(totals.tablesDeposit)}</span>
                    </div>
                  )}
                  {totals.servicesTotal > 0 && (
                    <div className="total-item">
                      <span>Dịch vụ</span>
                      <span>{formatCurrency(totals.servicesTotal)}</span>
                    </div>
                  )}
                  {totals.customDeposit > 0 && (
                    <div className="total-item">
                      <span>Tiền cọc thêm</span>
                      <span>{formatCurrency(totals.customDeposit)}</span>
                    </div>
                  )}
                  <div className="total-item total-final">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(totals.totalAmount)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingPage;
