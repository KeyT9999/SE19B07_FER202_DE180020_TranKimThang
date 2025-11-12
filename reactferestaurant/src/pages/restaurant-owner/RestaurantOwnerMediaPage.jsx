/**
 * RestaurantOwnerMediaPage Component
 * Manage media/images for a restaurant
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerMediaPage.css';

function RestaurantOwnerMediaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');

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
          const found = Array.isArray(allRes.data) 
            ? allRes.data.find(r => r.restaurantId === parseInt(id))
            : null;
          if (found) setRestaurant(found);
        }
      }
      
      // Mock media data
      const mediaData = [];
      setMedia(mediaData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadUrl.trim()) {
      setErrorWithTimeout('Vui lòng nhập URL hình ảnh.');
      return;
    }

    try {
      // TODO: Upload media
      setSuccessWithTimeout('Đã thêm hình ảnh thành công.');
      setShowUploadModal(false);
      setUploadUrl('');
      await loadData();
    } catch (error) {
      console.error('Error uploading media:', error);
      setErrorWithTimeout('Không thể thêm hình ảnh.');
    }
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    try {
      // TODO: Delete media
      setSuccessWithTimeout('Đã xóa hình ảnh thành công.');
      await loadData();
    } catch (error) {
      console.error('Error deleting media:', error);
      setErrorWithTimeout('Không thể xóa hình ảnh.');
    }
  };

  if (loading) {
    return <Loading message="Đang tải hình ảnh..." />;
  }

  return (
    <div className="restaurant-owner-media-page">
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
            <i className="fas fa-images me-2"></i>
            Quản lý hình ảnh
          </h1>
          {restaurant && (
            <p className="page-subtitle-owner">
              {restaurant.restaurantName}
            </p>
          )}
        </div>

        <Card className="actions-card-owner mb-4">
          <Card.Body>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload me-2"></i>
              Thêm hình ảnh
            </Button>
          </Card.Body>
        </Card>

        {media.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-images fa-3x text-muted mb-3"></i>
              <h5>Chưa có hình ảnh nào</h5>
              <p className="text-muted mb-4">
                Bắt đầu bằng cách thêm hình ảnh cho nhà hàng.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
              >
                <i className="fas fa-upload me-2"></i>
                Thêm hình ảnh
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {media.map((item) => (
              <Col md={4} key={item.mediaId || item.id} className="mb-4">
                <Card className="media-card-owner">
                  <div className="media-image-wrapper-owner">
                    <img
                      src={item.url || item.imageUrl}
                      alt={item.caption || 'Restaurant image'}
                      className="media-image-owner"
                    />
                    <div className="media-overlay-owner">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.mediaId || item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                  {item.caption && (
                    <Card.Body>
                      <p className="media-caption-owner mb-0">{item.caption}</p>
                    </Card.Body>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Upload Modal */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm hình ảnh</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>URL hình ảnh</Form.Label>
              <Form.Control
                type="url"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default RestaurantOwnerMediaPage;

