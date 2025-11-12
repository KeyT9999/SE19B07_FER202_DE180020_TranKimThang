/**
 * ForgotPasswordPage Component
 * Page for password recovery
 */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorWithTimeout('Vui lòng nhập email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorWithTimeout('Email không hợp lệ.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement forgot password API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setSuccessWithTimeout('Email khôi phục mật khẩu đã được gửi!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      setErrorWithTimeout('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="forgot-password-page">
        <section style={{ padding: 'var(--ds-space-12) 0' }}>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Card className="ds-card">
                  <Card.Body className="text-center py-5">
                    <div className="success-icon mb-4">
                      <i className="fas fa-envelope-check"></i>
                    </div>
                    <h3>Email đã được gửi!</h3>
                    <p className="text-muted mb-4">
                      Chúng tôi đã gửi email khôi phục mật khẩu đến <strong>{email}</strong>.
                      Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to="/login">
                        <Button variant="primary">
                          <i className="fas fa-arrow-left me-2"></i>
                          Quay lại đăng nhập
                        </Button>
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

  return (
    <main className="forgot-password-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <Card className="ds-card">
                <Card.Body>
                  <div className="page-header mb-4">
                    <h2 className="page-title">
                      <i className="fas fa-key me-2"></i>
                      Quên mật khẩu
                    </h2>
                    <p className="page-subtitle">
                      Nhập email của bạn để nhận link khôi phục mật khẩu
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Gửi email khôi phục
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

export default ForgotPasswordPage;

