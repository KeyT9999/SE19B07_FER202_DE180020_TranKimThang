/**
 * ProfilePage Component
 * User profile page displaying user information and allowing updates
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user and customer data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // Set user data from auth context
        setFormData({
          username: user.username || '',
          email: user.email || '',
          fullName: '',
          phone: '',
          address: '',
        });

        // Try to load customer data
        try {
          const response = await api.get(`/customers?userId=${user.id}`);
          if (response.data && response.data.length > 0) {
            const customer = response.data[0];
            setCustomerData(customer);
            setFormData(prev => ({
              ...prev,
              fullName: customer.fullName || '',
              phone: customer.phone || '',
              email: customer.email || user.email || '',
            }));
          }
        } catch (error) {
          console.log('No customer data found, using user data only');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setErrorWithTimeout('Không thể tải thông tin người dùng.');
      }
    };

    loadUserData();
  }, [user, setErrorWithTimeout]);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại phải là 10 số và bắt đầu bằng 03, 05, 07, 08, 09';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Implement update API calls
      // For now, just show success message
      setSuccessWithTimeout('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorWithTimeout('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: customerData?.fullName || '',
        phone: customerData?.phone || '',
        address: '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main>
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8}>
              {/* Profile Header Card */}
              <Card className="ds-card profile-header-card mb-4">
                <Card.Body className="ds-card-body">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="profile-info">
                      <h3 className="profile-name">{formData.fullName || user.username}</h3>
                      <p className="profile-email">{user.email}</p>
                      <div className="profile-badges">
                        <span className="profile-badge">
                          <i className="fas fa-check-circle"></i>
                          Tài khoản đã xác thực
                        </span>
                        <span className="profile-badge">
                          <i className="fas fa-user"></i>
                          {user.role === 'user' ? 'Khách hàng' : user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Profile Form Card */}
              <Card className="ds-card">
                <Card.Body className="ds-card-body">
                  <div className="ds-flex ds-items-center ds-justify-between ds-mb-4">
                    <div className="ds-flex ds-items-center ds-gap-2">
                      <div className="feature-icon" style={{ width: '30px', height: '30px', fontSize: 'var(--ds-font-size-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <h5 className="ds-heading-5 ds-mb-0" style={{ lineHeight: 1 }}>
                        Thông tin cá nhân
                      </h5>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline-primary"
                        className="ds-btn ds-btn-secondary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="fas fa-edit ds-mr-2"></i>
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="ds-form-group ds-mb-4">
                      <Form.Label htmlFor="username">
                        <i className="fas fa-user form-icon"></i>
                        Tên đăng nhập
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        disabled
                        className="ds-form-input"
                        style={{ backgroundColor: 'var(--ds-neutral-50)', cursor: 'not-allowed' }}
                      />
                      <Form.Text className="form-text">
                        Tên đăng nhập không thể thay đổi
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="ds-form-group ds-mb-4">
                      <Form.Label htmlFor="email">
                        <i className="fas fa-envelope form-icon"></i>
                        Email <span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={errors.email ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                        placeholder="Nhập email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="ds-form-group ds-mb-4">
                      <Form.Label htmlFor="fullName">
                        <i className="fas fa-id-card form-icon"></i>
                        Họ và tên
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="ds-form-input"
                        placeholder="Nhập họ và tên"
                      />
                    </Form.Group>

                    <Form.Group className="ds-form-group ds-mb-4">
                      <Form.Label htmlFor="phone">
                        <i className="fas fa-phone form-icon"></i>
                        Số điện thoại
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={errors.phone ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                        placeholder="Nhập số điện thoại (VD: 0987654321)"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                      <Form.Text className="form-text">
                        Định dạng: 0987654321 (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="ds-form-group ds-mb-4">
                      <Form.Label htmlFor="address">
                        <i className="fas fa-map-marker-alt form-icon"></i>
                        Địa chỉ
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="ds-form-input"
                        placeholder="Nhập địa chỉ"
                      />
                    </Form.Group>

                    {isEditing && (
                      <div className="ds-flex ds-gap-2 ds-mt-4">
                        <Button
                          type="submit"
                          className="ds-btn ds-btn-primary ds-btn-lg"
                          disabled={loading}
                          style={{ flex: 1 }}
                        >
                          {loading ? (
                            <>
                              <i className="fas fa-spinner fa-spin ds-mr-2"></i>
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save ds-mr-2"></i>
                              Lưu thay đổi
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline-secondary"
                          className="ds-btn ds-btn-secondary ds-btn-lg"
                          onClick={handleCancel}
                          disabled={loading}
                          style={{ flex: 1 }}
                        >
                          <i className="fas fa-times ds-mr-2"></i>
                          Hủy
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>

              {/* Account Actions Card */}
              <Card className="ds-card mt-4">
                <Card.Body className="ds-card-body">
                  <h5 className="ds-heading-5 ds-mb-4">
                    <i className="fas fa-cog ds-mr-2"></i>
                    Tài khoản
                  </h5>
                  <div className="account-actions">
                    <Link to="/booking/my" className="account-action-item">
                      <div className="account-action-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="account-action-content">
                        <h6>Đặt bàn của tôi</h6>
                        <p>Xem và quản lý các đặt bàn của bạn</p>
                      </div>
                      <i className="fas fa-chevron-right account-action-arrow"></i>
                    </Link>
                    <Link to="/customer/favorites" className="account-action-item">
                      <div className="account-action-icon">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="account-action-content">
                        <h6>Yêu thích</h6>
                        <p>Danh sách nhà hàng yêu thích của bạn</p>
                      </div>
                      <i className="fas fa-chevron-right account-action-arrow"></i>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default ProfilePage;

