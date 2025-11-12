/**
 * ResetPasswordPage Component
 * Page for resetting password with token
 */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setErrorWithTimeout('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorWithTimeout('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorWithTimeout('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement reset password API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setSuccessWithTimeout('Đặt lại mật khẩu thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorWithTimeout('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="reset-password-page">
        <section style={{ padding: 'var(--ds-space-12) 0' }}>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Card className="ds-card">
                  <Card.Body className="text-center py-5">
                    <div className="success-icon mb-4">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>Đặt lại mật khẩu thành công!</h3>
                    <p className="text-muted mb-4">
                      Mật khẩu của bạn đã được đặt lại. Bạn sẽ được chuyển đến trang đăng nhập.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="reset-password-page">
        <section style={{ padding: 'var(--ds-space-12) 0' }}>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Card className="ds-card">
                  <Card.Body className="text-center py-5">
                    <div className="error-icon mb-4">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Link không hợp lệ</h3>
                    <p className="text-muted mb-4">
                      Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                    </p>
                    <Link to="/forgot-password">
                      <Button variant="primary">
                        Yêu cầu link mới
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="reset-password-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <Card className="ds-card">
                <Card.Body>
                  <div className="page-header mb-4">
                    <h2 className="page-title">
                      <i className="fas fa-key me-2"></i>
                      Đặt lại mật khẩu
                    </h2>
                    <p className="page-subtitle">
                      Nhập mật khẩu mới của bạn
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                      <Form.Text className="text-muted">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Xác nhận mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Đặt lại mật khẩu
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link to="/login" className="text-decoration-none">
                        <i className="fas fa-arrow-left me-2"></i>
                        Quay lại đăng nhập
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default ResetPasswordPage;

