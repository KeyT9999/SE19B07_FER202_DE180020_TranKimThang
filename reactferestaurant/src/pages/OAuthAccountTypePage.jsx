/**
 * OAuthAccountTypePage Component
 * Allows users to select account type after OAuth login (Customer or Restaurant Owner)
 */

import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './OAuthAccountTypePage.css';

function OAuthAccountTypePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) {
      alert('Vui lòng chọn loại tài khoản');
      return;
    }

    // TODO: Call API to complete OAuth registration with account type
    // For now, just redirect based on account type
    if (selectedType === 'customer') {
      navigate('/');
    } else if (selectedType === 'restaurant_owner') {
      navigate('/restaurant-owner/dashboard');
    }
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <div className="oauth-account-type-page">
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="account-type-card-luxury">
              <Card.Body className="py-5">
                <div className="brand-section-luxury mb-4">
                  <div className="brand-icon-luxury mb-3">
                    <i className="fas fa-utensils"></i>
                  </div>
                  <h1 className="brand-title-luxury">Book Eat</h1>
                  <p className="brand-subtitle-luxury">Đặt bàn online, giữ chỗ ngay</p>
                </div>

                <div className="welcome-message-luxury mb-4">
                  <h4>
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Đăng nhập Google thành công!
                  </h4>
                  <p>Vui lòng chọn loại tài khoản bạn muốn sử dụng:</p>
                </div>

                <div className="account-type-options-luxury mb-4">
                  <div
                    className={`account-type-option-luxury ${selectedType === 'customer' ? 'selected' : ''}`}
                    onClick={() => handleSelectType('customer')}
                  >
                    <i className="fas fa-user"></i>
                    <div>
                      <h5>Khách hàng</h5>
                      <span>Đặt bàn và trải nghiệm dịch vụ nhà hàng</span>
                    </div>
                  </div>
                  
                  <div
                    className={`account-type-option-luxury ${selectedType === 'restaurant_owner' ? 'selected' : ''}`}
                    onClick={() => handleSelectType('restaurant_owner')}
                  >
                    <i className="fas fa-store"></i>
                    <div>
                      <h5>Chủ nhà hàng</h5>
                      <span>Quản lý nhà hàng và đón tiếp khách</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleContinue}
                  disabled={!selectedType}
                  className="btn-continue-luxury w-100 mb-3"
                >
                  <i className="fas fa-arrow-right me-2"></i>
                  Tiếp tục
                </Button>
                
                <Button
                  variant="outline-secondary"
                  onClick={handleGoBack}
                  className="btn-back-luxury w-100"
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Quay lại
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default OAuthAccountTypePage;

