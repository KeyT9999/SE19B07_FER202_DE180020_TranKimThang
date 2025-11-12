/**
 * ChangePasswordPage Component
 * Page for changing password when logged in
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import './ChangePasswordPage.css';

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorWithTimeout('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorWithTimeout('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorWithTimeout('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement change password API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessWithTimeout('Đổi mật khẩu thành công!');
      navigate('/auth/profile');
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorWithTimeout('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="change-password-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="ds-card">
                <Card.Body>
                  <div className="page-header mb-4">
                    <h2 className="page-title">
                      <i className="fas fa-lock me-2"></i>
                      Đổi mật khẩu
                    </h2>
                    <p className="page-subtitle">
                      Thay đổi mật khẩu của bạn
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu hiện tại</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                      <Form.Text className="text-muted">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
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

                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate('/auth/profile')}
                        className="flex-grow-1"
                      >
                        <i className="fas fa-times me-2"></i>
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="flex-grow-1"
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Đổi mật khẩu
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
      </section>
    </main>
  );
}

export default ChangePasswordPage;

