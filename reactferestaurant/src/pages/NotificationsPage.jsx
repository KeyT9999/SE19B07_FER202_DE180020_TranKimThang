/**
 * NotificationsPage Component
 * Page displaying user notifications
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Loading from '../components/common/Loading';
import './NotificationsPage.css';

function NotificationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout } = useApp();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated, navigate, user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // TODO: Implement notifications API endpoint
      // For now, return empty array
      setNotifications([]);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setErrorWithTimeout('Không thể tải thông báo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // TODO: Implement mark as read API
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      booking: 'fa-calendar-check',
      payment: 'fa-credit-card',
      review: 'fa-star',
      system: 'fa-bell',
      default: 'fa-info-circle',
    };
    return iconMap[type] || iconMap.default;
  };

  if (loading) {
    return <Loading />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="notifications-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="page-header mb-4">
            <h1 className="page-title">
              <i className="fas fa-bell me-2"></i>
              Thông báo
              {unreadCount > 0 && (
                <Badge bg="danger" className="ms-2">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="page-subtitle">Xem tất cả thông báo của bạn</p>
          </div>

          {notifications.length === 0 ? (
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                <h5>Chưa có thông báo nào</h5>
                <p className="text-muted">Bạn chưa có thông báo nào.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              <Col xs={12}>
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`ds-card notification-card mb-3 ${!notification.read ? 'notification-unread' : ''}`}
                  >
                    <Card.Body>
                      <div className="notification-content">
                        <div className="notification-icon">
                          <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                        </div>
                        <div className="notification-body">
                          <h6 className="notification-title">{notification.title}</h6>
                          <p className="notification-message">{notification.message}</p>
                          <div className="notification-footer">
                            <span className="notification-time">
                              {formatDate(notification.createdAt)}
                            </span>
                            {notification.link && (
                              <Link to={notification.link} className="notification-link">
                                Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="link"
                            size="sm"
                            className="notification-mark-read"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <i className="fas fa-check"></i>
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
}

export default NotificationsPage;

