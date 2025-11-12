/**
 * Error404Page Component
 * 404 Not Found error page
 */

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Error404Page.css';

function Error404Page() {
  const navigate = useNavigate();

  return (
    <main className="error-404-page">
      <Container className="text-center">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Trang không tìm thấy</h2>
          <p className="error-message">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <div className="error-actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              <i className="fas fa-home me-2"></i>
              Về trang chủ
            </Button>
            <Button variant="outline-primary" size="lg" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>
              Quay lại
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Error404Page;

