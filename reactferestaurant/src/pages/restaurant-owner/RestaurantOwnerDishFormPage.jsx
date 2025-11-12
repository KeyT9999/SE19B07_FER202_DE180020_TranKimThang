/**
 * RestaurantOwnerDishFormPage Component
 * Form to create or edit a dish
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerDishFormPage.css';

function RestaurantOwnerDishFormPage() {
  const { id, dishId } = useParams(); // id = restaurantId, dishId = dish id
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'main',
    price: '',
    imageUrl: '',
    status: 'ACTIVE',
  });

  const isEditMode = !!dishId;

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
    if (dishId) {
      loadDish();
    }
  }, [id, dishId]);

  const loadRestaurant = async () => {
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
  };

  const loadDish = async () => {
    try {
      setLoading(true);
      // TODO: Load dish data
      // const dishRes = await api.get(`/dishes/${dishId}`);
      // setFormData(dishRes.data);
    } catch (error) {
      console.error('Error loading dish:', error);
      setErrorWithTimeout('Không thể tải thông tin món ăn.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorWithTimeout('Vui lòng nhập tên món ăn.');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setErrorWithTimeout('Vui lòng nhập giá hợp lệ.');
      return;
    }

    try {
      setSaving(true);
      
      const dishData = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: id ? parseInt(id) : null,
      };

      if (isEditMode) {
        // TODO: Update dish
        // await api.put(`/dishes/${dishId}`, dishData);
        setSuccessWithTimeout('Đã cập nhật món ăn thành công.');
      } else {
        // TODO: Create dish
        // await api.post('/dishes', dishData);
        setSuccessWithTimeout('Đã thêm món ăn thành công.');
      }

      navigate(id 
        ? `/restaurant-owner/restaurants/${id}/dishes`
        : '/restaurant-owner/dishes'
      );
    } catch (error) {
      console.error('Error saving dish:', error);
      setErrorWithTimeout('Không thể lưu món ăn.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Đang tải thông tin món ăn..." />;
  }

  return (
    <div className="restaurant-owner-dish-form-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button
            variant="link"
            onClick={() => navigate(id 
              ? `/restaurant-owner/restaurants/${id}/dishes`
              : '/restaurant-owner/dishes'
            )}
            className="back-button-owner"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title-owner">
            <i className="fas fa-utensils me-2"></i>
            {isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
          </h1>
          {restaurant && (
            <p className="page-subtitle-owner">
              {restaurant.restaurantName}
            </p>
          )}
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="form-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin món ăn
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên món ăn <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập tên món ăn"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Nhập mô tả món ăn"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Danh mục <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="appetizer">Khai vị</option>
                          <option value="main">Món chính</option>
                          <option value="dessert">Tráng miệng</option>
                          <option value="drink">Đồ uống</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giá (VNĐ) <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>URL hình ảnh</Form.Label>
                    <Form.Control
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="ACTIVE">Đang bán</option>
                      <option value="INACTIVE">Tạm ngưng</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="form-actions-owner">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(id 
                        ? `/restaurant-owner/restaurants/${id}/dishes`
                        : '/restaurant-owner/dishes'
                      )}
                      disabled={saving}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          {isEditMode ? 'Cập nhật' : 'Thêm món ăn'}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerDishFormPage;

