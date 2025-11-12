/**
 * RestaurantOwnerMediaUploadPage Component
 * Upload media/images for a restaurant
 */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import './RestaurantOwnerMediaUploadPage.css';

function RestaurantOwnerMediaUploadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setErrorWithTimeout('Vui lòng nhập URL hình ảnh.');
      return;
    }

    try {
      setUploading(true);
      // TODO: Upload media
      setSuccessWithTimeout('Đã thêm hình ảnh thành công.');
      navigate(id 
        ? `/restaurant-owner/restaurants/${id}/media`
        : '/restaurant-owner/media'
      );
    } catch (error) {
      console.error('Error uploading media:', error);
      setErrorWithTimeout('Không thể thêm hình ảnh.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="restaurant-owner-media-upload-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button
            variant="link"
            onClick={() => navigate(id 
              ? `/restaurant-owner/restaurants/${id}/media`
              : '/restaurant-owner/media'
            )}
            className="back-button-owner"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <h1 className="page-title-owner">
            <i className="fas fa-upload me-2"></i>
            Upload hình ảnh
          </h1>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="form-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-image me-2"></i>
                Thông tin hình ảnh
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL hình ảnh <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      type="text"
                      name="caption"
                      value={formData.caption}
                      onChange={handleChange}
                      placeholder="Nhập mô tả hình ảnh (tùy chọn)"
                    />
                  </Form.Group>

                  <div className="form-actions-owner">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(id 
                        ? `/restaurant-owner/restaurants/${id}/media`
                        : '/restaurant-owner/media'
                      )}
                      disabled={uploading}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang upload...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload me-2"></i>
                          Upload
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

export default RestaurantOwnerMediaUploadPage;

