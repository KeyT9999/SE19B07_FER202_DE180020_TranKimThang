/**
 * RegisterSuccessPage Component
 * Displays success message after user registration
 */

import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterSuccessPage.css';

function RegisterSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="register-success-page">
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="success-card-luxury">
              <Card.Body className="text-center py-5">
                <div className="success-icon-container mb-4">
                  <i className="fas fa-check-circle success-icon-large"></i>
                </div>
                
                <h1 className="success-title-luxury mb-4">
                  Đăng ký thành công!
                </h1>
                
                <div className="success-message-luxury mb-4">
                  Cảm ơn bạn đã đăng ký tài khoản tại <strong>Book Eat</strong>!
                </div>
                
                <div className="email-info-box mb-4">
                  <p className="mb-2">
                    <i className="fas fa-envelope me-2"></i>
                    <strong>Vui lòng kiểm tra email của bạn</strong>
                  </p>
                  <p className="mb-2">
                    Chúng tôi đã gửi một email xác thực đến địa chỉ email bạn đã đăng ký. 
                    Hãy click vào link trong email để kích hoạt tài khoản.
                  </p>
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Link xác thực sẽ hết hạn sau 24 giờ.
                  </small>
                </div>
                
                <div className="action-buttons-luxury mt-4">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="btn-luxury-primary"
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Đăng nhập ngay
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={() => navigate('/')}
                    className="btn-luxury-outline"
                  >
                    <i className="fas fa-home me-2"></i>
                    Về trang chủ
                  </Button>
                </div>
                
                <div className="mt-4">
                  <small className="text-muted">
                    Không nhận được email?{' '}
                    <Link to="/register" className="resend-link">
                      Đăng ký lại
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default RegisterSuccessPage;

