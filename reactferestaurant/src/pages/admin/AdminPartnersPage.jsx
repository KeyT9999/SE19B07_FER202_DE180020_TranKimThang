/**
 * AdminPartnersPage Component
 * Manage partners for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminPartnersPage.css';

function AdminPartnersPage() {
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load restaurants as partners
      const response = await api.get('/restaurants');
      const restaurantsData = Array.isArray(response.data) ? response.data : [];
      setPartners(restaurantsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (partnerId, newStatus) => {
    try {
      // TODO: Update partner status
      setSuccessWithTimeout('Đã cập nhật trạng thái thành công.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể cập nhật trạng thái.');
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-partners-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-handshake me-2"></i>Quản lý đối tác</h1>
        </div>

        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: '300px' }}>
              <option value="all">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </Form.Select>
          </Card.Body>
        </Card>

        {partners.length === 0 ? (
          <Card className="empty-state-card-admin">
            <Card.Body className="text-center py-5">
              <i className="fas fa-handshake fa-3x text-muted mb-3"></i>
              <h5>Chưa có đối tác nào</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="partners-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách đối tác ({partners.length})</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Tên nhà hàng</th>
                    <th>Địa chỉ</th>
                    <th>Chủ sở hữu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.restaurantId || partner.id}>
                      <td><strong>{partner.restaurantName}</strong></td>
                      <td>{partner.address}</td>
                      <td>{partner.ownerName || 'N/A'}</td>
                      <td><Badge bg={partner.status === 'ACTIVE' ? 'success' : 'secondary'}>{partner.status || 'ACTIVE'}</Badge></td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => window.location.href = `/restaurants/${partner.restaurantId || partner.id}`}>
                          <i className="fas fa-eye me-1"></i>Xem
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

export default AdminPartnersPage;

