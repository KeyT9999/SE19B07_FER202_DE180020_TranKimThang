/**
 * Error403Page Component
 * 403 Forbidden error page
 */

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Error403Page.css';

function Error403Page() {
  const navigate = useNavigate();

  return (
    <main className="error-403-page">
      <Container className="text-center">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="error-code">403</h1>
          <h2 className="error-title">Không có quyền truy cập</h2>
          <p className="error-message">
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản phù hợp.
          </p>
          <div className="error-actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
              <i className="fas fa-sign-in-alt me-2"></i>
              Đăng nhập
            </Button>
            <Button variant="outline-primary" size="lg" onClick={() => navigate('/')}>
              <i className="fas fa-home me-2"></i>
              Về trang chủ
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Error403Page;

