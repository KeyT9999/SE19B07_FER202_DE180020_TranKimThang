/**
 * RestaurantOwnerVoucherFormPage Component
 * Create or edit voucher
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerVoucherFormPage.css';

function RestaurantOwnerVoucherFormPage() {
  const { id, voucherId } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    expiryDate: '',
    maxUses: '',
    status: 'ACTIVE',
  });

  const isEditMode = !!voucherId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      setErrorWithTimeout('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      setSaving(true);
      // TODO: Save voucher
      setSuccessWithTimeout(isEditMode ? 'Đã cập nhật voucher thành công.' : 'Đã tạo voucher thành công.');
      navigate(id ? `/restaurant-owner/restaurants/${id}/vouchers` : '/restaurant-owner/vouchers');
    } catch (error) {
      setErrorWithTimeout('Không thể lưu voucher.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="restaurant-owner-voucher-form-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate(id ? `/restaurant-owner/restaurants/${id}/vouchers` : '/restaurant-owner/vouchers')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-ticket-alt me-2"></i>{isEditMode ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}</h1>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="form-card-owner">
              <Card.Header className="card-header-owner"><i className="fas fa-info-circle me-2"></i>Thông tin voucher</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mã voucher <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="code" value={formData.code} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Loại giảm giá <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="discountType" value={formData.discountType} onChange={handleChange} required>
                          <option value="PERCENTAGE">Phần trăm (%)</option>
                          <option value="FIXED">Số tiền cố định</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giá trị giảm <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hạn sử dụng</Form.Label>
                        <Form.Control type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="form-actions-owner">
                    <Button variant="secondary" onClick={() => navigate(id ? `/restaurant-owner/restaurants/${id}/vouchers` : '/restaurant-owner/vouchers')} disabled={saving}>Hủy</Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                      {saving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo voucher')}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerVoucherFormPage;

