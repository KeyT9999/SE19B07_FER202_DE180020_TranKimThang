/**
 * RestaurantOwnerVoucherDetailPage Component
 * Voucher detail view for restaurant owner
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerVoucherDetailPage.css';

function RestaurantOwnerVoucherDetailPage() {
  const { id, voucherId } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [voucher, setVoucher] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id, voucherId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (id) {
        try {
          const resRes = await api.get(`/restaurants/${id}`);
          setRestaurant(resRes.data);
        } catch (e) {
          const allRes = await api.get('/restaurants');
          const found = Array.isArray(allRes.data) 
            ? allRes.data.find(r => r.restaurantId === parseInt(id))
            : null;
          if (found) setRestaurant(found);
        }
      }
      
      // TODO: Load voucher detail
      // const voucherRes = await api.get(`/vouchers/${voucherId}`);
      // setVoucher(voucherRes.data);
      setVoucher(null);
    } catch (error) {
      console.error('Error loading voucher:', error);
      setErrorWithTimeout('Không thể tải thông tin voucher.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải..." />;
  if (!voucher) return <Alert variant="danger">Không tìm thấy voucher</Alert>;

  return (
    <div className="restaurant-owner-voucher-detail-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate(id ? `/restaurant-owner/restaurants/${id}/vouchers` : '/restaurant-owner/vouchers')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-ticket-alt me-2"></i>Chi tiết voucher</h1>
          {restaurant && <p className="page-subtitle-owner">{restaurant.restaurantName}</p>}
        </div>

        <Row>
          <Col lg={8}>
            <Card className="detail-card-owner mb-4">
              <Card.Header className="card-header-owner">Thông tin voucher</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Mã voucher:</strong> <Badge bg="primary">{voucher.code}</Badge></p>
                    <p><strong>Mô tả:</strong> {voucher.description || 'N/A'}</p>
                    <p><strong>Loại giảm giá:</strong> {voucher.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}</p>
                    <p><strong>Giá trị giảm:</strong> 
                      <strong className="text-success ms-2">
                        {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : formatCurrency(voucher.discountValue)}
                      </strong>
                    </p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Hạn sử dụng:</strong> {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}</p>
                    <p><strong>Số lần sử dụng tối đa:</strong> {voucher.maxUses || 'Không giới hạn'}</p>
                    <p><strong>Số lần đã sử dụng:</strong> {voucher.usedCount || 0}</p>
                    <p><strong>Trạng thái:</strong> <Badge bg={voucher.status === 'ACTIVE' ? 'success' : 'secondary'}>{voucher.status}</Badge></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="usage-card-owner">
              <Card.Header className="card-header-owner"><i className="fas fa-chart-line me-2"></i>Thống kê sử dụng</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="stat-item-owner">
                      <div className="stat-value-owner text-primary">{voucher.usedCount || 0}</div>
                      <div className="stat-label-owner">Đã sử dụng</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-item-owner">
                      <div className="stat-value-owner text-success">
                        {voucher.maxUses ? (voucher.maxUses - (voucher.usedCount || 0)) : '∞'}
                      </div>
                      <div className="stat-label-owner">Còn lại</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-item-owner">
                      <div className="stat-value-owner text-info">
                        {voucher.maxUses ? Math.round(((voucher.usedCount || 0) / voucher.maxUses) * 100) : 0}%
                      </div>
                      <div className="stat-label-owner">Tỷ lệ sử dụng</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="actions-card-owner">
              <Card.Header className="card-header-owner">Thao tác</Card.Header>
              <Card.Body>
                <Link to={id ? `/restaurant-owner/restaurants/${id}/vouchers/${voucherId}/edit` : `/restaurant-owner/vouchers/${voucherId}/edit`} className="w-100 d-block mb-2">
                  <Button variant="primary" className="w-100">
                    <i className="fas fa-edit me-2"></i>Chỉnh sửa
                  </Button>
                </Link>
                <Button variant="outline-secondary" className="w-100" onClick={() => navigate(id ? `/restaurant-owner/restaurants/${id}/vouchers` : '/restaurant-owner/vouchers')}>
                  <i className="fas fa-list me-2"></i>Danh sách voucher
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerVoucherDetailPage;

