/**
 * Error500Page Component
 * 500 Internal Server Error page
 */

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Error500Page.css';

function Error500Page() {
  const navigate = useNavigate();

  return (
    <main className="error-500-page">
      <Container className="text-center">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-server"></i>
          </div>
          <h1 className="error-code">500</h1>
          <h2 className="error-title">Lỗi máy chủ</h2>
          <p className="error-message">
            Đã xảy ra lỗi trên máy chủ. Chúng tôi đang khắc phục sự cố này. Vui lòng thử lại sau.
          </p>
          <div className="error-actions">
            <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
              <i className="fas fa-redo me-2"></i>
              Tải lại trang
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

export default Error500Page;

