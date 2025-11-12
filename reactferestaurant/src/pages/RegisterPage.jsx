/**
 * RegisterPage Component
 * Registration page with account type selection
 */

import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(true);
  const [accountType, setAccountType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setShowAccountTypeModal(false);
    if (type === 'restaurant_owner') {
      // Update form title for restaurant owner
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else {
      const emailRegex = /.*@(gmail\.com|outlook\.com\.vn|yahoo\.com|hotmail\.com|student\.ctu\.edu\.vn|ctu\.edu\.vn)$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email phải thuộc một trong các domain: @gmail.com, @outlook.com.vn, @yahoo.com, @hotmail.com, @student.ctu.edu.vn, @ctu.edu.vn';
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại phải là 10 số và bắt đầu bằng 03, 05, 07, 08, 09';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountType) {
      setShowAccountTypeModal(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Check if username already exists
      const usersResponse = await api.get('/users');
      const existingUsers = usersResponse.data || [];
      const usernameExists = existingUsers.some(
        (u) => u.username.toLowerCase() === formData.username.toLowerCase().trim()
      );
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase().trim()
      );

      if (usernameExists) {
        setErrors({ username: 'Username đã tồn tại. Vui lòng chọn username khác.' });
        setErrorWithTimeout('Username đã tồn tại.');
        return;
      }

      if (emailExists) {
        setErrors({ email: 'Email đã được sử dụng. Vui lòng sử dụng email khác.' });
        setErrorWithTimeout('Email đã được sử dụng.');
        return;
      }

      // Get the next ID
      const maxId = existingUsers.length > 0 
        ? Math.max(...existingUsers.map(u => parseInt(u.id) || 0))
        : 0;
      const nextId = (maxId + 1).toString();

      // Create user object
      const newUser = {
        id: nextId,
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phoneNumber.trim() || null,
        address: formData.address.trim() || null,
        role: accountType === 'restaurant_owner' ? 'restaurant_owner' : 'user',
        status: 'active'
      };

      // Create user in database
      const userResponse = await api.post('/users', newUser);
      console.log('User created:', userResponse.data);

      // If account type is customer, also create customer record
      if (accountType === 'customer' || !accountType) {
        try {
          const customersResponse = await api.get('/customers');
          const existingCustomers = customersResponse.data || [];
          const maxCustomerId = existingCustomers.length > 0
            ? Math.max(...existingCustomers.map(c => parseInt(c.customerId) || 0))
            : 0;
          const nextCustomerId = maxCustomerId + 1;

          const newCustomer = {
            customerId: nextCustomerId,
            userId: parseInt(nextId),
            fullName: formData.fullName.trim(),
            phone: formData.phoneNumber.trim() || null,
            email: formData.email.trim()
          };

          await api.post('/customers', newCustomer);
          console.log('Customer created:', newCustomer);
        } catch (customerError) {
          console.warn('Could not create customer record:', customerError);
          // Continue even if customer creation fails
        }
      }

      setSuccessWithTimeout('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (err.response.status === 409) {
          errorMessage = 'Username hoặc email đã tồn tại.';
        } else {
          errorMessage = `Lỗi server: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra json-server có đang chạy không.';
      }
      
      setErrorWithTimeout(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="ds-bg-gray-50" style={{ padding: 'var(--ds-space-8) 0' }}>
        <Container>
          <nav className="ds-breadcrumb" aria-label="breadcrumb">
            <ol className="ds-breadcrumb-list">
              <li className="ds-breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="ds-breadcrumb-item active">
                <span>Đăng ký</span>
              </li>
            </ol>
          </nav>

          <div className="ds-flex ds-flex-col ds-items-center ds-text-center ds-gap-2">
            <h4 className="ds-heading-4">Đăng ký tài khoản</h4>
            <p className="ds-text-sm ds-text-secondary" style={{ maxWidth: '480px', fontStyle: 'italic' }}>
              {accountType === 'restaurant_owner'
                ? 'Quản lý nhà hàng và kết nối với khách hàng'
                : 'Tạo tài khoản để trải nghiệm dịch vụ đặt bàn nhà hàng tốt nhất'}
            </p>
          </div>
        </Container>
      </section>

      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="auth-form-container">
            <Card className="ds-card">
              <Card.Body>
                <div className="ds-text-center ds-mb-4">
                  <div className="ds-flex ds-items-center ds-justify-center ds-gap-2">
                    <div className="feature-icon" style={{ width: '30px', height: '30px', fontSize: 'var(--ds-font-size-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <h5 className="ds-heading-5 ds-mb-0" style={{ lineHeight: 1 }}>
                      {accountType === 'restaurant_owner' ? 'Đăng ký chủ nhà hàng' : 'Đăng ký tài khoản'}
                    </h5>
                  </div>
                </div>

                <Form onSubmit={handleSubmit} id="registerForm">
                  <input type="hidden" id="accountType" value={accountType} />

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="username">
                      <i className="fas fa-user form-icon"></i>
                      Username <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className={errors.username ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nhập username"
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="email">
                      <i className="fas fa-envelope form-icon"></i>
                      Email <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      className={errors.email ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email (VD: example@gmail.com)"
                      pattern=".*@(gmail\.com|outlook\.com\.vn|yahoo\.com|hotmail\.com|student\.ctu\.edu\.vn|ctu\.edu\.vn)$"
                      title="Email phải thuộc một trong các domain: @gmail.com, @outlook.com.vn, @yahoo.com, @hotmail.com, @student.ctu.edu.vn, @ctu.edu.vn"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                    <small className="form-text">
                      Chỉ chấp nhận: @gmail.com, @outlook.com.vn, @yahoo.com, @hotmail.com, @student.ctu.edu.vn, @ctu.edu.vn
                    </small>
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="fullName">
                      <i className="fas fa-id-card form-icon"></i>
                      Họ và tên <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className={errors.fullName ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="phoneNumber">
                      <i className="fas fa-phone form-icon"></i>
                      Số điện thoại
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      className={errors.phoneNumber ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại (VD: 0987654321)"
                      pattern="^(0[3|5|7|8|9])[0-9]{8}$"
                      title="Số điện thoại phải là 10 số và bắt đầu bằng 03, 05, 07, 08, 09"
                    />
                    {errors.phoneNumber && (
                      <div className="invalid-feedback">{errors.phoneNumber}</div>
                    )}
                    <small className="form-text">
                      Định dạng: 0987654321 (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
                    </small>
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="address">
                      <i className="fas fa-map-marker-alt form-icon"></i>
                      Địa chỉ
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className={errors.address ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ (tùy chọn)"
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-4">
                    <Form.Label htmlFor="password">
                      <i className="fas fa-lock form-icon"></i>
                      Mật khẩu <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className={errors.password ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      minLength={8}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      title="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                    <small className="form-text">
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)
                    </small>
                  </Form.Group>

                  <Form.Group className="ds-form-group ds-mb-6">
                    <Form.Label htmlFor="confirmPassword">
                      <i className="fas fa-lock form-icon"></i>
                      Xác nhận mật khẩu <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className={errors.confirmPassword ? 'ds-form-input ds-form-input-error' : 'ds-form-input'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </Form.Group>

                  <div className="ds-mb-4">
                    <Button
                      type="submit"
                      className="ds-btn ds-btn-primary ds-btn-lg"
                      style={{ width: '100%' }}
                      disabled={loading}
                    >
                      <i className="fas fa-user-plus ds-mr-2"></i>
                      {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                  </div>
                </Form>

                <div className="ds-flex ds-items-center ds-gap-4 ds-text-center ds-text-secondary ds-mb-4" style={{ textTransform: 'uppercase', fontSize: 'var(--ds-font-size-xs)' }}>
                  <span style={{ flex: 1, height: '1px', background: 'var(--ds-neutral-300)' }}></span>
                  <span>hoặc</span>
                  <span style={{ flex: 1, height: '1px', background: 'var(--ds-neutral-300)' }}></span>
                </div>

                <div className="ds-mb-4">
                  <Button
                    variant="secondary"
                    className="ds-btn ds-btn-secondary ds-btn-lg"
                    style={{ width: '100%' }}
                    disabled
                  >
                    <i className="fab fa-google ds-mr-2"></i>
                    Tiếp tục với Google
                  </Button>
                </div>

                <div className="ds-text-center">
                  <p className="ds-mb-0 ds-text-secondary">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="ds-link ds-link-primary" style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'none' }}>
                      <i className="fas fa-sign-in-alt ds-mr-1"></i>
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </section>

      {/* Account Type Selection Modal */}
      {showAccountTypeModal && (
        <div
          id="accountTypeOverlay"
          className={`account-type-overlay ${showAccountTypeModal ? '' : 'hidden'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accountTypeTitle"
          aria-hidden={!showAccountTypeModal}
        >
          <div className="account-type-modal">
            <Card className="ds-card">
              <Card.Body style={{ padding: 'var(--ds-space-8)' }}>
                <div className="ds-text-center ds-mb-6">
                  <h2 id="accountTypeTitle" className="ds-heading-3 ds-mb-2">
                    Chọn loại tài khoản
                  </h2>
                  <p className="ds-text-large ds-text-secondary">
                    Bạn muốn đăng ký với vai trò nào?
                  </p>
                </div>
                <div className="account-type-actions">
                  <button
                    type="button"
                    className="ds-card account-type-card"
                    onClick={() => handleAccountTypeSelect('customer')}
                  >
                    <div className="ds-card-body">
                      <span className="account-type-icon" aria-hidden="true">
                        <i className="fas fa-user"></i>
                      </span>
                      <div>
                        <h5 className="account-type-title">Đăng ký khách hàng</h5>
                        <p className="account-type-desc">
                          Dùng để đặt bàn, khám phá nhà hàng và nhận ưu đãi.
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="ds-card account-type-card"
                    onClick={() => handleAccountTypeSelect('restaurant_owner')}
                  >
                    <div className="ds-card-body">
                      <span className="account-type-icon" aria-hidden="true">
                        <i className="fas fa-store"></i>
                      </span>
                      <div>
                        <h5 className="account-type-title">Đăng ký chủ nhà hàng</h5>
                        <p className="account-type-desc">
                          Quản lý nhà hàng, đặt bàn và chương trình ưu đãi dành riêng.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}

export default RegisterPage;

