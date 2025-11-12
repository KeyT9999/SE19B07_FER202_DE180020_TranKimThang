/**
 * AdminWithdrawalManagementPage Component
 * Manage withdrawal requests for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminWithdrawalManagementPage.css';

function AdminWithdrawalManagementPage() {
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock withdrawal requests
      setWithdrawals([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu rút tiền này?')) return;
    try {
      // TODO: Approve withdrawal
      setSuccessWithTimeout('Đã duyệt yêu cầu rút tiền thành công.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể duyệt yêu cầu.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu rút tiền này?')) return;
    try {
      // TODO: Reject withdrawal
      setSuccessWithTimeout('Đã từ chối yêu cầu rút tiền.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể từ chối yêu cầu.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-withdrawal-management-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-money-bill-wave me-2"></i>Quản lý rút tiền</h1>
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

        {withdrawals.length === 0 ? (
          <Card className="empty-state-card-admin">
            <Card.Body className="text-center py-5">
              <i className="fas fa-money-bill-wave fa-3x text-muted mb-3"></i>
              <h5>Chưa có yêu cầu rút tiền nào</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="withdrawals-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách yêu cầu rút tiền</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Người yêu cầu</th>
                    <th>Số tiền</th>
                    <th>Ngân hàng</th>
                    <th>Số tài khoản</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td>{w.requesterName}</td>
                      <td><strong>{formatCurrency(w.amount)}</strong></td>
                      <td>{w.bankName}</td>
                      <td>{w.bankAccount}</td>
                      <td>{w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td><Badge bg={w.status === 'PENDING' ? 'warning' : w.status === 'APPROVED' ? 'success' : 'danger'}>{w.status}</Badge></td>
                      <td>
                        {w.status === 'PENDING' && (
                          <>
                            <Button variant="success" size="sm" className="me-2" onClick={() => handleApprove(w.id)}>
                              <i className="fas fa-check me-1"></i>Duyệt
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleReject(w.id)}>
                              <i className="fas fa-times me-1"></i>Từ chối
                            </Button>
                          </>
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

export default AdminWithdrawalManagementPage;

