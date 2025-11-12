/**
 * AdminRestaurantRequestDetailPage Component
 * Detail view for restaurant registration request
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminRestaurantRequestDetailPage.css';

function AdminRestaurantRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load request detail
      setRequest(null);
    } catch (error) {
      console.error('Error loading request:', error);
      setErrorWithTimeout('Không thể tải thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu này?')) return;
    try {
      setProcessing(true);
      // TODO: Approve request
      setSuccessWithTimeout('Đã duyệt yêu cầu thành công.');
      navigate('/admin/restaurant-requests');
    } catch (error) {
      setErrorWithTimeout('Không thể duyệt yêu cầu.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    try {
      setProcessing(true);
      // TODO: Reject request
      setSuccessWithTimeout('Đã từ chối yêu cầu.');
      navigate('/admin/restaurant-requests');
    } catch (error) {
      setErrorWithTimeout('Không thể từ chối yêu cầu.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;
  if (!request) return <Alert variant="danger">Không tìm thấy yêu cầu</Alert>;

  return (
    <div className="admin-restaurant-request-detail-page">
      <Container>
        <div className="page-header-admin mb-4">
          <Button variant="link" onClick={() => navigate('/admin/restaurant-requests')} className="back-button-admin">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-admin"><i className="fas fa-clipboard-list me-2"></i>Chi tiết yêu cầu</h1>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="detail-card-admin mb-4">
              <Card.Header className="card-header-admin">Thông tin nhà hàng</Card.Header>
              <Card.Body>
                <p><strong>Tên nhà hàng:</strong> {request.restaurantName}</p>
                <p><strong>Địa chỉ:</strong> {request.address}</p>
                <p><strong>Chủ sở hữu:</strong> {request.ownerName}</p>
                <p><strong>Trạng thái:</strong> <Badge bg={request.status === 'PENDING' ? 'warning' : request.status === 'APPROVED' ? 'success' : 'danger'}>{request.status}</Badge></p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="actions-card-admin">
              <Card.Header className="card-header-admin">Thao tác</Card.Header>
              <Card.Body>
                {request.status === 'PENDING' && (
                  <>
                    <Button variant="success" className="w-100 mb-2" onClick={handleApprove} disabled={processing}>
                      <i className="fas fa-check me-2"></i>Duyệt
                    </Button>
                    <Button variant="danger" className="w-100" onClick={handleReject} disabled={processing}>
                      <i className="fas fa-times me-2"></i>Từ chối
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminRestaurantRequestDetailPage;

