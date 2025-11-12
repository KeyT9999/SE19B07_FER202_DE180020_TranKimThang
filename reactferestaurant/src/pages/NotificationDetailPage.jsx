/**
 * NotificationDetailPage Component
 * Page displaying notification detail
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Loading from '../components/common/Loading';
import './NotificationDetailPage.css';

function NotificationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout } = useApp();
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadNotification();
  }, [isAuthenticated, navigate, id]);

  const loadNotification = async () => {
    try {
      setLoading(true);
      // TODO: Implement notification detail API
      // For now, set to null
      setNotification(null);
    } catch (error) {
      console.error('Error loading notification:', error);
      setErrorWithTimeout('Không thể tải thông báo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!notification) {
    return (
      <main className="notification-detail-page">
        <section style={{ padding: 'var(--ds-space-12) 0' }}>
          <Container>
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-exclamation-circle fa-3x text-muted mb-3"></i>
                <h5>Không tìm thấy thông báo</h5>
                <p className="text-muted">Thông báo không tồn tại hoặc đã bị xóa.</p>
                <Button variant="primary" onClick={() => navigate('/notifications')}>
                  <i className="fas fa-arrow-left me-2"></i>
                  Quay lại danh sách
                </Button>
              </Card.Body>
            </Card>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="notification-detail-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="mb-3">
            <Button variant="outline-secondary" onClick={() => navigate('/notifications')}>
              <i className="fas fa-arrow-left me-2"></i>
              Quay lại
            </Button>
          </div>
          
          <Card className="ds-card">
            <Card.Body>
              <div className="notification-detail-header mb-4">
                <div className="notification-detail-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div>
                  <h2 className="notification-detail-title">{notification.title}</h2>
                  <p className="notification-detail-date">
                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="notification-detail-content">
                <p>{notification.message}</p>
                {notification.content && (
                  <div className="notification-detail-extra">
                    {notification.content}
                  </div>
                )}
              </div>
              
              {notification.link && (
                <div className="notification-detail-actions mt-4">
                  <Button
                    variant="primary"
                    onClick={() => navigate(notification.link)}
                  >
                    <i className="fas fa-arrow-right me-2"></i>
                    Xem chi tiết
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>
    </main>
  );
}

export default NotificationDetailPage;

