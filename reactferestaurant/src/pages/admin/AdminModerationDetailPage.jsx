/**
 * AdminModerationDetailPage Component
 * Moderation detail view
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminModerationDetailPage.css';

function AdminModerationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load moderation detail
      setItem(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      // TODO: Approve content
      setSuccessWithTimeout('Đã duyệt nội dung.');
      navigate('/admin/moderation');
    } catch (error) {
      setErrorWithTimeout('Không thể duyệt nội dung.');
    }
  };

  const handleReject = async () => {
    try {
      // TODO: Reject content
      setSuccessWithTimeout('Đã từ chối nội dung.');
      navigate('/admin/moderation');
    } catch (error) {
      setErrorWithTimeout('Không thể từ chối nội dung.');
    }
  };

  if (loading) return <Loading message="Đang tải..." />;
  if (!item) return <Alert variant="danger">Không tìm thấy</Alert>;

  return (
    <div className="admin-moderation-detail-page">
      <Container>
        <div className="page-header-admin mb-4">
          <Button variant="link" onClick={() => navigate('/admin/moderation')} className="back-button-admin">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-admin"><i className="fas fa-shield-alt me-2"></i>Chi tiết kiểm duyệt</h1>
        </div>

        <Card className="detail-card-admin">
          <Card.Body>
            <p><strong>Loại:</strong> <Badge bg="info">{item.type}</Badge></p>
            <p><strong>Nội dung:</strong> {item.content}</p>
            <p><strong>Trạng thái:</strong> <Badge bg={item.status === 'PENDING' ? 'warning' : 'success'}>{item.status}</Badge></p>
            {item.status === 'PENDING' && (
              <div className="mt-3">
                <Button variant="success" className="me-2" onClick={handleApprove}>
                  <i className="fas fa-check me-2"></i>Duyệt
                </Button>
                <Button variant="danger" onClick={handleReject}>
                  <i className="fas fa-times me-2"></i>Từ chối
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminModerationDetailPage;

