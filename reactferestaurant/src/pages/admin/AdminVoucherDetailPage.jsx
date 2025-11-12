/**
 * AdminVoucherDetailPage Component
 * Voucher detail view for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminVoucherDetailPage.css';

function AdminVoucherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load voucher detail
      setVoucher(null);
    } catch (error) {
      console.error('Error loading voucher:', error);
      setErrorWithTimeout('Không thể tải thông tin voucher.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;
  if (!voucher) return <Alert variant="danger">Không tìm thấy voucher</Alert>;

  return (
    <div className="admin-voucher-detail-page">
      <Container>
        <div className="page-header-admin mb-4">
          <Button variant="link" onClick={() => navigate('/admin/vouchers')} className="back-button-admin">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-admin"><i className="fas fa-ticket-alt me-2"></i>Chi tiết voucher</h1>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="detail-card-admin">
              <Card.Header className="card-header-admin">Thông tin voucher</Card.Header>
              <Card.Body>
                <p><strong>Mã voucher:</strong> {voucher.code}</p>
                <p><strong>Mô tả:</strong> {voucher.description || 'N/A'}</p>
                <p><strong>Loại giảm giá:</strong> {voucher.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}</p>
                <p><strong>Giá trị giảm:</strong> {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : `${voucher.discountValue} VNĐ`}</p>
                <p><strong>Hạn sử dụng:</strong> {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}</p>
                <p><strong>Trạng thái:</strong> <Badge bg={voucher.status === 'ACTIVE' ? 'success' : 'secondary'}>{voucher.status}</Badge></p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="actions-card-admin">
              <Card.Header className="card-header-admin">Thao tác</Card.Header>
              <Card.Body>
                <Button variant="primary" className="w-100 mb-2" onClick={() => navigate(`/admin/vouchers/${id}/edit`)}>
                  <i className="fas fa-edit me-2"></i>Chỉnh sửa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminVoucherDetailPage;

