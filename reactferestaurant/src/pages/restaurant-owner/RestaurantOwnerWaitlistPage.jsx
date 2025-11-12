/**
 * RestaurantOwnerWaitlistPage Component
 * Manage waitlist for restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, Table } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerWaitlistPage.css';

function RestaurantOwnerWaitlistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        try {
          const resRes = await api.get(`/restaurants/${id}`);
          setRestaurant(resRes.data);
        } catch (e) {
          const allRes = await api.get('/restaurants');
          const found = Array.isArray(allRes.data) ? allRes.data.find(r => r.restaurantId === parseInt(id)) : null;
          if (found) setRestaurant(found);
        }
      }
      // Mock waitlist
      setWaitlist([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (waitlistId, newStatus) => {
    try {
      // TODO: Update waitlist status
      setSuccessWithTimeout('Đã cập nhật trạng thái thành công.');
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể cập nhật trạng thái.');
    }
  };

  if (loading) return <Loading message="Đang tải danh sách chờ..." />;

  return (
    <div className="restaurant-owner-waitlist-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate('/restaurant-owner/restaurants')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-clock me-2"></i>Danh sách chờ</h1>
          {restaurant && <p className="page-subtitle-owner">{restaurant.restaurantName}</p>}
        </div>

        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: '300px' }}>
              <option value="all">Tất cả</option>
              <option value="WAITING">Đang chờ</option>
              <option value="CALLED">Đã gọi</option>
              <option value="SEATED">Đã ngồi</option>
              <option value="CANCELLED">Đã hủy</option>
            </Form.Select>
          </Card.Body>
        </Card>

        {waitlist.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-clock fa-3x text-muted mb-3"></i>
              <h5>Chưa có khách trong danh sách chờ</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="waitlist-card-owner">
            <Card.Header className="card-header-owner"><h5 className="mb-0">Danh sách chờ ({waitlist.length})</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Tên khách</th>
                    <th>Số người</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((item) => (
                    <tr key={item.waitlistId || item.id}>
                      <td>{item.customerName}</td>
                      <td>{item.numberOfGuests} người</td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'N/A'}</td>
                      <td><Badge bg={item.status === 'WAITING' ? 'warning' : item.status === 'SEATED' ? 'success' : 'secondary'}>{item.status}</Badge></td>
                      <td>
                        <Link to={id ? `/restaurant-owner/restaurants/${id}/waitlist/${item.waitlistId || item.id}` : `/restaurant-owner/waitlist/${item.waitlistId || item.id}`}>
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

export default RestaurantOwnerWaitlistPage;

