/**
 * AdminModerationPage Component
 * Content moderation for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminModerationPage.css';

function AdminModerationPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock moderation items
      setItems([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="admin-moderation-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-shield-alt me-2"></i>Kiểm duyệt nội dung</h1>
        </div>

        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ maxWidth: '300px' }}>
              <option value="all">Tất cả</option>
              <option value="review">Đánh giá</option>
              <option value="comment">Bình luận</option>
              <option value="restaurant">Nhà hàng</option>
            </Form.Select>
          </Card.Body>
        </Card>

        {items.length === 0 ? (
          <Card className="empty-state-card-admin">
            <Card.Body className="text-center py-5">
              <i className="fas fa-shield-alt fa-3x text-muted mb-3"></i>
              <h5>Chưa có nội dung cần kiểm duyệt</h5>
            </Card.Body>
          </Card>
        ) : (
          <Card className="moderation-card-admin">
            <Card.Header className="card-header-admin"><h5 className="mb-0">Danh sách cần kiểm duyệt</h5></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Loại</th>
                    <th>Nội dung</th>
                    <th>Người báo cáo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><Badge bg="info">{item.type}</Badge></td>
                      <td>{item.content}</td>
                      <td>{item.reporter}</td>
                      <td><Badge bg={item.status === 'PENDING' ? 'warning' : 'success'}>{item.status}</Badge></td>
                      <td>
                        <Link to={`/admin/moderation/${item.id}`}>
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

export default AdminModerationPage;

