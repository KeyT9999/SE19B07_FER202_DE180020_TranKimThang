/**
 * RestaurantOwnerWaitlistDetailPage Component
 * Waitlist detail view
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerWaitlistDetailPage.css';

function RestaurantOwnerWaitlistDetailPage() {
  const { id, waitlistId } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [waitlist, setWaitlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [waitlistId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load waitlist detail
      setWaitlist(null);
    } catch (error) {
      console.error('Error loading waitlist:', error);
      setErrorWithTimeout('Không thể tải thông tin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;
  if (!waitlist) return <Alert variant="danger">Không tìm thấy thông tin</Alert>;

  return (
    <div className="restaurant-owner-waitlist-detail-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate(id ? `/restaurant-owner/restaurants/${id}/waitlist` : '/restaurant-owner/waitlist')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-clock me-2"></i>Chi tiết danh sách chờ</h1>
        </div>

        <Card className="detail-card-owner">
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Tên khách:</strong> {waitlist.customerName}</p>
                <p><strong>Số người:</strong> {waitlist.numberOfGuests}</p>
                <p><strong>Thời gian:</strong> {waitlist.createdAt ? new Date(waitlist.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
                <p><strong>Trạng thái:</strong> <Badge bg="warning">{waitlist.status}</Badge></p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RestaurantOwnerWaitlistDetailPage;

