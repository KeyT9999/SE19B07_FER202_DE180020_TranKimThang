/**
 * AdminVouchersPage Component
 * Manage vouchers for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminVouchersPage.css';

function AdminVouchersPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock vouchers
      setVouchers([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-vouchers-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-ticket-alt me-2"></i>Quản lý voucher</h1>
        </div>

        <Card className="vouchers-card-admin">
          <Card.Header className="card-header-admin">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Danh sách voucher</h5>
              <Link to="/admin/vouchers/new">
                <Button variant="primary"><i className="fas fa-plus me-2"></i>Thêm voucher</Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {vouchers.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
                <h5>Chưa có voucher nào</h5>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Mã voucher</th>
                    <th>Mô tả</th>
                    <th>Giảm giá</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id}>
                      <td><strong>{v.code}</strong></td>
                      <td>{v.description}</td>
                      <td>{v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `${v.discountValue} VNĐ`}</td>
                      <td><Badge bg={v.status === 'ACTIVE' ? 'success' : 'secondary'}>{v.status}</Badge></td>
                      <td>
                        <Link to={`/admin/vouchers/${v.id}`} className="me-2">
                          <Button variant="outline-primary" size="sm"><i className="fas fa-eye me-1"></i>Chi tiết</Button>
                        </Link>
                        <Link to={`/admin/vouchers/${v.id}/analytics`}>
                          <Button variant="outline-info" size="sm"><i className="fas fa-chart-bar me-1"></i>Thống kê</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminVouchersPage;

