/**
 * VerifyResultPage Component
 * Displays verification result (success or error) after email verification
 */

import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './VerifyResultPage.css';

function VerifyResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check URL parameters for verification status
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const unverified = searchParams.get('unverified');
    const locked = searchParams.get('locked');

    if (success === 'true') {
      setIsSuccess(true);
      setMessage('Email của bạn đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.');
    } else if (error) {
      setIsSuccess(false);
      setMessage(decodeURIComponent(error));
    } else if (unverified) {
      setIsSuccess(false);
      setMessage('Tài khoản của bạn chưa được xác minh email. Vui lòng kiểm tra hộp thư để xác minh trước khi đăng nhập.');
    } else if (locked) {
      setIsSuccess(false);
      setMessage('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
    } else {
      setIsSuccess(false);
      setMessage('Link xác thực không hợp lệ hoặc đã hết hạn.');
    }
  }, [searchParams]);

  return (
    <div className="verify-result-page">
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="result-card-luxury">
              <Card.Body className="text-center py-5">
                <h1 className="result-title-luxury mb-4">
                  Kết quả xác thực
                </h1>
                
                {message && (
                  <Alert 
                    variant={isSuccess ? 'success' : 'danger'} 
                    className="result-alert-luxury"
                  >
                    <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                    {message}
                  </Alert>
                )}
                
                <div className="action-buttons-luxury mt-4">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="btn-luxury-primary"
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Đăng nhập
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={() => navigate('/register')}
                    className="btn-luxury-outline"
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Đăng ký lại
                  </Button>
                </div>
                
                <div className="mt-4">
                  <Link to="/" className="home-link-luxury">
                    <i className="fas fa-home me-2"></i>
                    Về trang chủ
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default VerifyResultPage;

