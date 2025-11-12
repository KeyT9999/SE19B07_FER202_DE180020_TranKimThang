/**
 * AdminRefundRequestsPage Component
 * Manage refund requests
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminRefundRequestsPage.css';

function AdminRefundRequestsPage() {
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
      // Mock refund requests
      setRequests([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // TODO: Approve refund
      setSuccessWithTimeout('Đã duyệt yêu cầu hoàn tiền.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể duyệt yêu cầu.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-refund-requests-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-money-bill-wave me-2"></i>Yêu cầu hoàn tiền</h1>
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
              <i className="fas fa-money-bill-wave fa-3x text-muted mb-3"></i>
              <h5>Chưa có yêu cầu hoàn tiền nào</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="refund-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách yêu cầu</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Mã đặt bàn</th>
                    <th>Khách hàng</th>
                    <th>Số tiền</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.bookingId}</td>
                      <td>{req.customerName}</td>
                      <td>{formatCurrency(req.amount)}</td>
                      <td>{req.reason}</td>
                      <td><Badge bg={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}>{req.status}</Badge></td>
                      <td>
                        {req.status === 'PENDING' && (
                          <Button variant="success" size="sm" onClick={() => handleApprove(req.id)}>
                            <i className="fas fa-check me-1"></i>Duyệt
                          </Button>
                        )}
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

export default AdminRefundRequestsPage;

