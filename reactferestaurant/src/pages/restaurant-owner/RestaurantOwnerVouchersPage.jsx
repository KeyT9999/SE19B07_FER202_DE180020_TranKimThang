/**
 * RestaurantOwnerVouchersPage Component
 * Manage vouchers for restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, Table, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerVouchersPage.css';

function RestaurantOwnerVouchersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [id]);

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
      // Mock vouchers
      setVouchers([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải voucher..." />;

  return (
    <div className="restaurant-owner-vouchers-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate('/restaurant-owner/restaurants')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-ticket-alt me-2"></i>Quản lý voucher</h1>
          {restaurant && <p className="page-subtitle-owner">{restaurant.restaurantName}</p>}
        </div>

        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="INACTIVE">Tạm ngưng</option>
                    <option value="EXPIRED">Hết hạn</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Link to={id ? `/restaurant-owner/restaurants/${id}/vouchers/new` : '/restaurant-owner/vouchers/new'} className="w-100">
                  <Button variant="primary" className="w-100"><i className="fas fa-plus me-2"></i>Thêm voucher mới</Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {vouchers.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
              <h5>Chưa có voucher nào</h5>
              <Link to={id ? `/restaurant-owner/restaurants/${id}/vouchers/new` : '/restaurant-owner/vouchers/new'}>
                <Button variant="primary"><i className="fas fa-plus me-2"></i>Thêm voucher mới</Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Card className="vouchers-card-owner">
            <Card.Header className="card-header-owner"><h5 className="mb-0">Danh sách voucher</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Mã voucher</th>
                    <th>Mô tả</th>
                    <th>Giảm giá</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.voucherId || v.id}>
                      <td><strong>{v.code}</strong></td>
                      <td>{v.description}</td>
                      <td>{v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}</td>
                      <td>{v.expiryDate ? new Date(v.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td><Badge bg={v.status === 'ACTIVE' ? 'success' : 'secondary'}>{v.status}</Badge></td>
                      <td>
                        <Link to={id ? `/restaurant-owner/restaurants/${id}/vouchers/${v.voucherId || v.id}` : `/restaurant-owner/vouchers/${v.voucherId || v.id}`} className="me-2">
                          <Button variant="outline-primary" size="sm"><i className="fas fa-eye me-1"></i>Chi tiết</Button>
                        </Link>
                        <Link to={id ? `/restaurant-owner/restaurants/${id}/vouchers/${v.voucherId || v.id}/edit` : `/restaurant-owner/vouchers/${v.voucherId || v.id}/edit`}>
                          <Button variant="outline-secondary" size="sm"><i className="fas fa-edit me-1"></i>Sửa</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default RestaurantOwnerVouchersPage;

