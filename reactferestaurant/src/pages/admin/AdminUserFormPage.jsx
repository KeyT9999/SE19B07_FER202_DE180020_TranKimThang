/**
 * AdminUserFormPage Component
 * Form for creating/editing users
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminUserFormPage.css';

function AdminUserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
    role: 'user',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      setFormData({
        username: user.username || '',
        password: '', // Don't load password
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'user',
        status: user.status || 'active',
      });
    } catch (error) {
      console.error('Error loading user:', error);
      setErrorWithTimeout('Không thể tải thông tin người dùng.');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
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
      
      const userData = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone || '',
        address: formData.address || '',
        role: formData.role,
        status: formData.status,
      };

      // Only include password if it's provided (for new users or password change)
      if (formData.password) {
        userData.password = formData.password;
      }

      if (isEdit) {
        // Get existing user data first
        const existingUser = await api.get(`/users/${id}`);
        await api.put(`/users/${id}`, {
          ...existingUser.data,
          ...userData,
        });
        setSuccessWithTimeout('Đã cập nhật người dùng thành công.');
      } else {
        await api.post('/users', userData);
        setSuccessWithTimeout('Đã tạo người dùng thành công.');
      }

      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setErrorWithTimeout('Không thể lưu người dùng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Đang tải thông tin người dùng..." />;
  }

  return (
    <div className="admin-user-form-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin">
            <i className={`fas fa-${isEdit ? 'edit' : 'user-plus'} me-2`}></i>
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h1>
          <p className="page-subtitle-admin">
            {isEdit ? 'Cập nhật thông tin người dùng' : 'Tạo tài khoản người dùng mới'}
          </p>
        </div>

        <Card className="form-card-admin">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Tên đăng nhập <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      isInvalid={!!errors.username}
                      disabled={isEdit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Mật khẩu {!isEdit && <span className="text-danger">*</span>}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      isInvalid={!!errors.password}
                      placeholder={isEdit ? 'Để trống nếu không đổi mật khẩu' : ''}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    {isEdit && (
                      <Form.Text className="text-muted">
                        Để trống nếu không muốn thay đổi mật khẩu
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Họ tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      isInvalid={!!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vai trò</Form.Label>
                    <Form.Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="restaurant_owner">Chủ nhà hàng</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="locked">Đã khóa</option>
                      <option value="inactive">Không hoạt động</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="form-actions-admin">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/admin/users')}
                  disabled={saving}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
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

export default AdminUserFormPage;

