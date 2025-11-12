/**
 * RestaurantOwnerRestaurantFormPage Component
 * Form for creating/editing restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerRestaurantFormPage.css';

function RestaurantOwnerRestaurantFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    cuisineType: 'Vietnamese',
    openingHours: '09:00 - 22:00',
    averagePrice: '',
    websiteUrl: '',
    mainImageUrl: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${id}`);
      const restaurant = response.data;
      
      // If not found by id, try by restaurantId
      if (!restaurant || !restaurant.restaurantId) {
        const allRes = await api.get('/restaurants');
        const found = Array.isArray(allRes.data) 
          ? allRes.data.find(r => r.restaurantId === parseInt(id))
          : null;
        if (found) {
          Object.assign(restaurant, found);
        }
      }
      
      setFormData({
        restaurantName: restaurant.restaurantName || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        description: restaurant.description || '',
        cuisineType: restaurant.cuisineType || 'Vietnamese',
        openingHours: restaurant.openingHours || '09:00 - 22:00',
        averagePrice: restaurant.averagePrice || '',
        websiteUrl: restaurant.websiteUrl || '',
        mainImageUrl: restaurant.mainImageUrl || '',
      });
    } catch (error) {
      console.error('Error loading restaurant:', error);
      setErrorWithTimeout('Không thể tải thông tin nhà hàng.');
      navigate('/restaurant-owner/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Tên nhà hàng là bắt buộc';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (formData.averagePrice && isNaN(parseFloat(formData.averagePrice))) {
      newErrors.averagePrice = 'Giá trung bình phải là số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      
      const restaurantData = {
        restaurantName: formData.restaurantName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email || null,
        description: formData.description,
        cuisineType: formData.cuisineType,
        openingHours: formData.openingHours,
        averagePrice: formData.averagePrice ? parseInt(formData.averagePrice) : null,
        websiteUrl: formData.websiteUrl || null,
        mainImageUrl: formData.mainImageUrl || null,
        averageRating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEdit) {
        // Get existing restaurant first
        const existingRes = await api.get(`/restaurants/${id}`);
        const existing = existingRes.data;
        
        // If not found by id, try by restaurantId
        if (!existing || !existing.restaurantId) {
          const allRes = await api.get('/restaurants');
          const found = Array.isArray(allRes.data) 
            ? allRes.data.find(r => r.restaurantId === parseInt(id))
            : null;
          if (found) {
            Object.assign(existing, found);
          }
        }
        
        await api.put(`/restaurants/${existing.id || id}`, {
          ...existing,
          ...restaurantData,
          updatedAt: new Date().toISOString(),
        });
        setSuccessWithTimeout('Đã cập nhật nhà hàng thành công.');
      } else {
        // Generate restaurantId (find max + 1)
        const allRes = await api.get('/restaurants');
        const restaurants = Array.isArray(allRes.data) ? allRes.data : [];
        const maxId = restaurants.length > 0 
          ? Math.max(...restaurants.map(r => r.restaurantId || 0))
          : 0;
        
        restaurantData.restaurantId = maxId + 1;
        await api.post('/restaurants', restaurantData);
        setSuccessWithTimeout('Đã tạo nhà hàng thành công.');
      }

      navigate('/restaurant-owner/restaurants');
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setErrorWithTimeout('Không thể lưu nhà hàng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const cuisineTypes = [
    'Vietnamese', 'Italian', 'Japanese', 'Chinese', 'Korean', 
    'Thai', 'French', 'American', 'Seafood', 'BBQ', 'Other'
  ];

  if (loading) {
    return <Loading message="Đang tải thông tin nhà hàng..." />;
  }

  return (
    <div className="restaurant-owner-form-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className={`fas fa-${isEdit ? 'edit' : 'plus-circle'} me-2`}></i>
            {isEdit ? 'Chỉnh sửa nhà hàng' : 'Thêm nhà hàng mới'}
          </h1>
          <p className="page-subtitle-owner">
            {isEdit ? 'Cập nhật thông tin nhà hàng' : 'Tạo nhà hàng mới cho bạn'}
          </p>
        </div>

        <Card className="form-card-owner">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Tên nhà hàng <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      isInvalid={!!errors.restaurantName}
                      placeholder="Nhập tên nhà hàng"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.restaurantName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Loại ẩm thực <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.cuisineType}
                      onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                    >
                      {cuisineTypes.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Địa chỉ <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      isInvalid={!!errors.address}
                      placeholder="Nhập địa chỉ nhà hàng"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      isInvalid={!!errors.phone}
                      placeholder="028 1234 5678"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      isInvalid={!!errors.email}
                      placeholder="restaurant@example.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giờ mở cửa</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      placeholder="09:00 - 22:00"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá trung bình (VNĐ)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.averagePrice}
                      onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
                      isInvalid={!!errors.averagePrice}
                      placeholder="100000"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.averagePrice}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://restaurant.com"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hình ảnh chính (URL)</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.mainImageUrl}
                      onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Mô tả <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  isInvalid={!!errors.description}
                  placeholder="Mô tả về nhà hàng, đặc sản, không gian..."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="form-actions-owner">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/restaurant-owner/restaurants')}
                  disabled={saving}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RestaurantOwnerRestaurantFormPage;

