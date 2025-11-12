/**
 * AdminNotificationsPage Component
 * Manage system notifications for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminNotificationsPage.css';

function AdminNotificationsPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load notifications
      const response = await api.get('/notifications');
      const notificationsData = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      setSuccessWithTimeout('Đã xóa thông báo thành công.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể xóa thông báo.');
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-notifications-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-bell me-2"></i>Quản lý thông báo</h1>
        </div>

        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ maxWidth: '300px' }}>
                <option value="all">Tất cả</option>
                <option value="SYSTEM">Hệ thống</option>
                <option value="PROMOTION">Khuyến mãi</option>
                <option value="ANNOUNCEMENT">Thông báo</option>
              </Form.Select>
              <Link to="/admin/notifications/new">
                <Button variant="primary"><i className="fas fa-plus me-2"></i>Tạo thông báo mới</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        {notifications.length === 0 ? (
          <Card className="empty-state-card-admin">
            <Card.Body className="text-center py-5">
              <i className="fas fa-bell fa-3x text-muted mb-3"></i>
              <h5>Chưa có thông báo nào</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="notifications-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách thông báo</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Loại</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => (
                    <tr key={notif.id}>
                      <td>{notif.title}</td>
                      <td><Badge bg="info">{notif.type || 'SYSTEM'}</Badge></td>
                      <td>{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td><Badge bg={notif.status === 'ACTIVE' ? 'success' : 'secondary'}>{notif.status || 'ACTIVE'}</Badge></td>
                      <td>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(notif.id)}>
                          <i className="fas fa-trash me-1"></i>Xóa
                        </Button>
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

export default AdminNotificationsPage;

