/**
 * AdminRestaurantRequestsPage Component
 * Manage restaurant registration requests
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, Table, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminRestaurantRequestsPage.css';

function AdminRestaurantRequestsPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock requests
      setRequests([]);
    } catch (error) {
      console.error('Error loading requests:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      // TODO: Approve request
      setSuccessWithTimeout('Đã duyệt yêu cầu thành công.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể duyệt yêu cầu.');
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    try {
      // TODO: Reject request
      setSuccessWithTimeout('Đã từ chối yêu cầu.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể từ chối yêu cầu.');
    }
  };

  if (loading) return <Loading message="Đang tải yêu cầu..." />;

  return (
    <div className="admin-restaurant-requests-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-clipboard-list me-2"></i>Duyệt đăng ký nhà hàng</h1>
        </div>

        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: '300px' }}>
              <option value="all">Tất cả</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </Form.Select>
          </Card.Body>
        </Card>

        {requests.length === 0 ? (
          <Card className="empty-state-card-admin">
            <Card.Body className="text-center py-5">
              <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
              <h5>Chưa có yêu cầu nào</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="requests-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách yêu cầu</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Tên nhà hàng</th>
                    <th>Chủ sở hữu</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.restaurantName}</td>
                      <td>{req.ownerName}</td>
                      <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td><Badge bg={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}>{req.status}</Badge></td>
                      <td>
                        <Link to={`/admin/restaurant-requests/${req.id}`}>
                          <Button variant="outline-primary" size="sm"><i className="fas fa-eye me-1"></i>Chi tiết</Button>
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

export default AdminRestaurantRequestsPage;

