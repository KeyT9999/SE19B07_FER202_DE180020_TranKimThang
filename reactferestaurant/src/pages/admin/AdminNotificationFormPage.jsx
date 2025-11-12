/**
 * AdminNotificationFormPage Component
 * Create notification for admin
 */

import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import './AdminNotificationFormPage.css';

function AdminNotificationFormPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'SYSTEM',
    status: 'ACTIVE',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorWithTimeout('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      setSaving(true);
      await api.post('/notifications', formData);
      setSuccessWithTimeout('Đã tạo thông báo thành công.');
      navigate('/admin/notifications');
    } catch (error) {
      console.error('Error creating notification:', error);
      setErrorWithTimeout('Không thể tạo thông báo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-notification-form-page">
      <Container>
        <div className="page-header-admin mb-4">
          <Button variant="link" onClick={() => navigate('/admin/notifications')} className="back-button-admin">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-admin"><i className="fas fa-bell me-2"></i>Tạo thông báo mới</h1>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="form-card-admin">
              <Card.Header className="card-header-admin"><i className="fas fa-info-circle me-2"></i>Thông tin thông báo</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nội dung <span className="text-danger">*</span></Form.Label>
                    <Form.Control as="textarea" rows={6} name="content" value={formData.content} onChange={handleChange} required />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Loại <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                          <option value="SYSTEM">Hệ thống</option>
                          <option value="PROMOTION">Khuyến mãi</option>
                          <option value="ANNOUNCEMENT">Thông báo</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Trạng thái <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                          <option value="ACTIVE">Hoạt động</option>
                          <option value="INACTIVE">Tạm ngưng</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="form-actions-admin">
                    <Button variant="secondary" onClick={() => navigate('/admin/notifications')} disabled={saving}>Hủy</Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                      {saving ? 'Đang lưu...' : 'Tạo thông báo'}
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

export default AdminNotificationFormPage;

