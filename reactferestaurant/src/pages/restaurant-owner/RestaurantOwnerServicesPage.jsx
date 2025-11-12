/**
 * RestaurantOwnerServicesPage Component
 * Manage services for a restaurant
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerServicesPage.css';

function RestaurantOwnerServicesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    status: 'AVAILABLE',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurant
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
      
      // Load services
      const servicesRes = await api.get(`/services?restaurantId=${id}`);
      const servicesData = Array.isArray(servicesRes.data) ? servicesRes.data : [];
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      status: 'AVAILABLE',
    });
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      category: service.category || '',
      description: service.description || '',
      price: service.price || '',
      status: service.status || 'AVAILABLE',
    });
    setShowModal(true);
  };

  const handleSaveService = async () => {
    try {
      setSaving(true);
      
      const serviceData = {
        restaurantId: parseInt(id),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: formData.price ? parseInt(formData.price) : 0,
        status: formData.status,
      };

      if (editingService) {
        // Update existing service
        const existing = await api.get(`/services/${editingService.id || editingService.serviceId}`);
        await api.put(`/services/${editingService.id || editingService.serviceId}`, {
          ...existing.data,
          ...serviceData,
        });
        setSuccessWithTimeout('Đã cập nhật dịch vụ thành công.');
      } else {
        // Create new service
        const allServices = await api.get('/services');
        const allServicesData = Array.isArray(allServices.data) ? allServices.data : [];
        const maxServiceId = allServicesData.length > 0
          ? Math.max(...allServicesData.map(s => s.serviceId || 0))
          : 0;
        
        serviceData.serviceId = maxServiceId + 1;
        serviceData.serviceName = formData.name; // Add serviceName for compatibility
        await api.post('/services', serviceData);
        setSuccessWithTimeout('Đã thêm dịch vụ thành công.');
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving service:', error);
      setErrorWithTimeout('Không thể lưu dịch vụ. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ ${service.name || service.serviceName}?`)) {
      return;
    }

    try {
      await api.delete(`/services/${service.id || service.serviceId}`);
      setSuccessWithTimeout('Đã xóa dịch vụ thành công.');
      await loadData();
    } catch (error) {
      console.error('Error deleting service:', error);
      setErrorWithTimeout('Không thể xóa dịch vụ.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      AVAILABLE: { variant: 'success', text: 'Khả dụng' },
      UNAVAILABLE: { variant: 'danger', text: 'Không khả dụng' },
    };
    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const categories = [
    'Đồ uống', 'Món phụ', 'Dessert', 'Đặc biệt', 'Khác'
  ];

  if (loading) {
    return <Loading message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="restaurant-owner-services-page">
      <Container>
        <div className="page-header-owner mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button
                variant="link"
                onClick={() => navigate('/restaurant-owner/restaurants')}
                className="back-button-owner"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Quay lại
              </Button>
              <h1 className="page-title-owner">
                <i className="fas fa-concierge-bell me-2"></i>
                Quản lý dịch vụ - {restaurant?.restaurantName || 'Nhà hàng'}
              </h1>
              <p className="page-subtitle-owner">Quản lý các dịch vụ trong nhà hàng</p>
            </div>
            <Button variant="success" onClick={handleAddService}>
              <i className="fas fa-plus-circle me-2"></i>
              Thêm dịch vụ mới
            </Button>
          </div>
        </div>

        {services.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-concierge-bell fa-3x text-muted mb-3"></i>
              <h5>Chưa có dịch vụ nào</h5>
              <p className="text-muted mb-4">Thêm dịch vụ đầu tiên cho nhà hàng của bạn!</p>
              <Button variant="success" onClick={handleAddService}>
                <i className="fas fa-plus-circle me-2"></i>
                Thêm dịch vụ mới
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {services.map((service) => (
              <Col md={6} lg={4} key={service.serviceId || service.id} className="mb-4">
                <Card className="service-card-owner">
                  <Card.Body>
                    <div className="service-header-owner">
                      <h5>{service.name || service.serviceName}</h5>
                      {getStatusBadge(service.status)}
                    </div>
                    <div className="service-info-owner">
                      <Badge bg="info" className="mb-2">{service.category}</Badge>
                      {service.description && (
                        <p className="mb-2 text-muted">{service.description}</p>
                      )}
                      {service.price > 0 && (
                        <p className="mb-0">
                          <i className="fas fa-money-bill-wave me-2 text-success"></i>
                          <strong>{formatCurrency(service.price)}</strong>
                        </p>
                      )}
                    </div>
                    <div className="service-actions-owner">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditService(service)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteService(service)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Add/Edit Service Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên dịch vụ <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rượu vang, Salad bar, ..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Danh mục</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả về dịch vụ..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giá (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="100000"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="AVAILABLE">Khả dụng</option>
                  <option value="UNAVAILABLE">Không khả dụng</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveService} disabled={saving || !formData.name}>
              {saving ? 'Đang lưu...' : editingService ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default RestaurantOwnerServicesPage;

