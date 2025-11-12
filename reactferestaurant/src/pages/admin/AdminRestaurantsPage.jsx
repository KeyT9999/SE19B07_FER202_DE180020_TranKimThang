/**
 * AdminRestaurantsPage Component
 * Admin page for managing restaurants (list, search, delete)
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, InputGroup, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminRestaurantsPage.css';

function AdminRestaurantsPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchTerm, cuisineFilter]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants');
      const restaurantsData = Array.isArray(response.data) ? response.data : [];
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setErrorWithTimeout('Không thể tải danh sách nhà hàng.');
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.restaurantName?.toLowerCase().includes(search) ||
        restaurant.address?.toLowerCase().includes(search) ||
        restaurant.cuisineType?.toLowerCase().includes(search)
      );
    }

    // Cuisine filter
    if (cuisineFilter !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.cuisineType === cuisineFilter);
    }

    setFilteredRestaurants(filtered);
  };

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/restaurants/${restaurantToDelete.restaurantId}`);
      setSuccessWithTimeout('Đã xóa nhà hàng thành công.');
      setShowDeleteModal(false);
      setRestaurantToDelete(null);
      await loadRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setErrorWithTimeout('Không thể xóa nhà hàng.');
    } finally {
      setDeleting(false);
    }
  };

  const getCuisineBadge = (cuisine) => {
    const cuisineColors = {
      Vietnamese: 'primary',
      Italian: 'info',
      Seafood: 'success',
      BBQ: 'warning',
      Japanese: 'danger',
      Korean: 'secondary',
    };
    const color = cuisineColors[cuisine] || 'secondary';
    return <Badge bg={color}>{cuisine}</Badge>;
  };

  if (loading) {
    return <Loading message="Đang tải danh sách nhà hàng..." />;
  }

  // Get unique cuisine types for filter
  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisineType).filter(Boolean))];

  return (
    <div className="admin-restaurants-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin">
            <i className="fas fa-utensils me-2"></i>
            Quản lý nhà hàng
          </h1>
          <p className="page-subtitle-admin">Quản lý tất cả nhà hàng trong hệ thống</p>
        </div>

        {/* Filters */}
        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm theo tên, địa chỉ, loại ẩm thực..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Loại ẩm thực</Form.Label>
                  <Form.Select
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {cuisineTypes.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Restaurants List */}
        {filteredRestaurants.length === 0 ? (
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Không tìm thấy nhà hàng nào.
          </Alert>
        ) : (
          <Row>
            {filteredRestaurants.map((restaurant) => (
              <Col md={6} lg={4} key={restaurant.restaurantId} className="mb-4">
                <Card className="restaurant-card-admin">
                  {restaurant.mainImageUrl && (
                    <Card.Img
                      variant="top"
                      src={restaurant.mainImageUrl}
                      className="restaurant-image-admin"
                    />
                  )}
                  <Card.Body>
                    <div className="restaurant-header-admin">
                      <h5 className="restaurant-name-admin">{restaurant.restaurantName}</h5>
                      {getCuisineBadge(restaurant.cuisineType)}
                    </div>
                    <div className="restaurant-info-admin">
                      <p className="mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        {restaurant.address}
                      </p>
                      {restaurant.phone && (
                        <p className="mb-2">
                          <i className="fas fa-phone me-2 text-primary"></i>
                          {restaurant.phone}
                        </p>
                      )}
                      {restaurant.averageRating && (
                        <p className="mb-2">
                          <i className="fas fa-star me-2 text-warning"></i>
                          {restaurant.averageRating.toFixed(1)} ({restaurant.reviewCount || 0} đánh giá)
                        </p>
                      )}
                      {restaurant.averagePrice && (
                        <p className="mb-0">
                          <i className="fas fa-money-bill-wave me-2 text-success"></i>
                          {restaurant.averagePrice.toLocaleString('vi-VN')} VNĐ
                        </p>
                      )}
                    </div>
                    <div className="restaurant-actions-admin">
                      <Link to={`/restaurants/${restaurant.restaurantId}`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="fas fa-eye me-1"></i>
                          Xem
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(restaurant)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Xóa
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa nhà hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Bạn có chắc chắn muốn xóa nhà hàng <strong>{restaurantToDelete?.restaurantName}</strong>?</p>
            <p className="text-danger">Hành động này không thể hoàn tác!</p>
            <Alert variant="warning" className="mt-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Tất cả các đặt bàn và dữ liệu liên quan đến nhà hàng này cũng sẽ bị xóa.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminRestaurantsPage;

