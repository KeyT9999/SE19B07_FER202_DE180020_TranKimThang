/**
 * RestaurantOwnerDishesPage Component
 * Manage dishes for a restaurant
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, Table, Modal, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerDishesPage.css';

function RestaurantOwnerDishesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    filterDishes();
  }, [dishes, categoryFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurant
      if (id) {
        try {
          const resRes = await api.get(`/restaurants/${id}`);
          setRestaurant(resRes.data);
        } catch (e) {
          const allRes = await api.get('/restaurants');
          const found = Array.isArray(allRes.data) 
            ? allRes.data.find(r => r.restaurantId === parseInt(id))
            : null;
          if (found) setRestaurant(found);
        }
      }
      
      // Load dishes (mock - JSON Server doesn't have dishes endpoint)
      // In real app: api.get(`/dishes?restaurantId=${id}`)
      const dishesData = [];
      setDishes(dishesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const filterDishes = () => {
    let filtered = [...dishes];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    setFilteredDishes(filtered);
  };

  const handleDelete = async () => {
    if (!dishToDelete) return;

    try {
      // TODO: Call API to delete dish
      setSuccessWithTimeout('Đã xóa món ăn thành công.');
      setShowDeleteModal(false);
      setDishToDelete(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting dish:', error);
      setErrorWithTimeout('Không thể xóa món ăn.');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <Loading message="Đang tải danh sách món ăn..." />;
  }

  return (
    <div className="restaurant-owner-dishes-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button
            variant="link"
            onClick={() => navigate('/restaurant-owner/restaurants')}
            className="back-button-owner"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title-owner">
            <i className="fas fa-utensils me-2"></i>
            Quản lý món ăn
          </h1>
          {restaurant && (
            <p className="page-subtitle-owner">
              {restaurant.restaurantName}
            </p>
          )}
        </div>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body className="text-center">
                <div className="stat-number-owner text-primary">{dishes.length}</div>
                <div className="stat-label-owner">Tổng số món</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body className="text-center">
                <div className="stat-number-owner text-success">
                  {dishes.filter(d => d.status === 'ACTIVE').length}
                </div>
                <div className="stat-label-owner">Đang bán</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body className="text-center">
                <div className="stat-number-owner text-warning">
                  {dishes.filter(d => d.status === 'INACTIVE').length}
                </div>
                <div className="stat-label-owner">Tạm ngưng</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-owner">
              <Card.Body className="text-center">
                <div className="stat-number-owner text-info">
                  {dishes.filter(d => d.category).length}
                </div>
                <div className="stat-label-owner">Danh mục</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="appetizer">Khai vị</option>
                    <option value="main">Món chính</option>
                    <option value="dessert">Tráng miệng</option>
                    <option value="drink">Đồ uống</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Tạm ngưng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Link
                  to={id ? `/restaurant-owner/restaurants/${id}/dishes/new` : '/restaurant-owner/dishes/new'}
                  className="w-100"
                >
                  <Button variant="primary" className="w-100">
                    <i className="fas fa-plus me-2"></i>
                    Thêm món ăn mới
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Dishes List */}
        {filteredDishes.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-utensils fa-3x text-muted mb-3"></i>
              <h5>Chưa có món ăn nào</h5>
              <p className="text-muted mb-4">
                Bắt đầu bằng cách thêm món ăn đầu tiên.
              </p>
              <Link
                to={id ? `/restaurant-owner/restaurants/${id}/dishes/new` : '/restaurant-owner/dishes/new'}
              >
                <Button variant="primary">
                  <i className="fas fa-plus me-2"></i>
                  Thêm món ăn mới
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Card className="dishes-card-owner">
            <Card.Header className="card-header-owner">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Danh sách món ăn ({filteredDishes.length})
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên món</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDishes.map((dish) => (
                    <tr key={dish.dishId || dish.id}>
                      <td>
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="dish-thumbnail-owner"
                          />
                        ) : (
                          <div className="dish-placeholder-owner">
                            <i className="fas fa-utensils"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{dish.name}</strong>
                        {dish.description && (
                          <p className="text-muted mb-0 small">{dish.description}</p>
                        )}
                      </td>
                      <td>
                        <Badge bg="info">{dish.category || 'N/A'}</Badge>
                      </td>
                      <td>
                        <strong>{formatCurrency(dish.price)}</strong>
                      </td>
                      <td>
                        <Badge bg={dish.status === 'ACTIVE' ? 'success' : 'warning'}>
                          {dish.status === 'ACTIVE' ? 'Đang bán' : 'Tạm ngưng'}
                        </Badge>
                      </td>
                      <td>
                        <Link
                          to={id 
                            ? `/restaurant-owner/restaurants/${id}/dishes/${dish.dishId || dish.id}/edit`
                            : `/restaurant-owner/dishes/${dish.dishId || dish.id}/edit`
                          }
                          className="me-2"
                        >
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-edit me-1"></i>
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDishToDelete(dish);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="fas fa-trash me-1"></i>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa món ăn "{dishToDelete?.name}"? Hành động này không thể hoàn tác.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default RestaurantOwnerDishesPage;

