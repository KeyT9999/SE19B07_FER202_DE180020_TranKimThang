/**
 * PaymentFormPage Component
 * Page for payment form
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Loading from '../components/common/Loading';
import './PaymentFormPage.css';

function PaymentFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'momo',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    phone: user?.phone || '',
  });

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
    
    if (!bookingId) {
      setErrorWithTimeout('Thiếu thông tin đặt bàn.');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Implement payment API
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to payment result page
      navigate(`/payment/result?bookingId=${bookingId}&status=success`);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorWithTimeout('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="payment-form-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8}>
              <Card className="ds-card">
                <Card.Body>
                  <div className="payment-header mb-4">
                    <h2 className="payment-title">
                      <i className="fas fa-credit-card me-2"></i>
                      Thanh toán
                    </h2>
                    {amount && (
                      <p className="payment-amount">
                        Số tiền: <strong>{parseFloat(amount).toLocaleString('vi-VN')} VNĐ</strong>
                      </p>
                    )}
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Phương thức thanh toán</Form.Label>
                      <div className="payment-methods">
                        <Form.Check
                          type="radio"
                          id="momo"
                          name="paymentMethod"
                          value="momo"
                          checked={formData.paymentMethod === 'momo'}
                          onChange={handleChange}
                          label={
                            <div className="payment-method-option">
                              <i className="fab fa-cc-mastercard me-2"></i>
                              MoMo
                            </div>
                          }
                        />
                        <Form.Check
                          type="radio"
                          id="bank"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === 'bank'}
                          onChange={handleChange}
                          label={
                            <div className="payment-method-option">
                              <i className="fas fa-university me-2"></i>
                              Chuyển khoản ngân hàng
                            </div>
                          }
                        />
                        <Form.Check
                          type="radio"
                          id="cash"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleChange}
                          label={
                            <div className="payment-method-option">
                              <i className="fas fa-money-bill-wave me-2"></i>
                              Thanh toán tại nhà hàng
                            </div>
                          }
                        />
                      </div>
                    </Form.Group>

                    {formData.paymentMethod === 'bank' && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Số thẻ</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên chủ thẻ</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleChange}
                            placeholder="NGUYEN VAN A"
                          />
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Ngày hết hạn</Form.Label>
                              <Form.Control
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CVV</Form.Label>
                              <Form.Control
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                maxLength={3}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}

                    {formData.paymentMethod === 'momo' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại MoMo</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0987654321"
                        />
                      </Form.Group>
                    )}

                    <div className="payment-actions">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                        className="me-2"
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Quay lại
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
                            Xác nhận thanh toán
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

export default PaymentFormPage;

