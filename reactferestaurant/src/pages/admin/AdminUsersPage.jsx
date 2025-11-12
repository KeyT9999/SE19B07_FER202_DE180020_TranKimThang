/**
 * AdminUsersPage Component
 * Admin page for managing users (list, search, filter, lock/unlock, delete)
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, InputGroup, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminUsersPage.css';

function AdminUsersPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      const usersData = Array.isArray(response.data) ? response.data : [];
      // Filter out admin user from list (optional - or you can show it)
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setErrorWithTimeout('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.fullName?.toLowerCase().includes(search) ||
        user.phone?.includes(search)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'locked' : 'active';
      const user = users.find(u => u.id === userId);
      
      const updatedUser = {
        ...user,
        status: newStatus,
      };

      await api.put(`/users/${userId}`, updatedUser);
      setSuccessWithTimeout(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} người dùng thành công.`);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setErrorWithTimeout('Không thể thay đổi trạng thái người dùng.');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/users/${userToDelete.id}`);
      setSuccessWithTimeout('Đã xóa người dùng thành công.');
      setShowDeleteModal(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorWithTimeout('Không thể xóa người dùng.');
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { variant: 'danger', text: 'Admin' },
      user: { variant: 'primary', text: 'User' },
      restaurant_owner: { variant: 'info', text: 'Chủ nhà hàng' },
    };
    const roleInfo = roleMap[role] || { variant: 'secondary', text: role };
    return <Badge bg={roleInfo.variant}>{roleInfo.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { variant: 'success', text: 'Hoạt động' },
      locked: { variant: 'danger', text: 'Đã khóa' },
      inactive: { variant: 'secondary', text: 'Không hoạt động' },
    };
    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) {
    return <Loading message="Đang tải danh sách người dùng..." />;
  }

  return (
    <div className="admin-users-page">
      <Container>
        <div className="page-header-admin mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title-admin">
                <i className="fas fa-users me-2"></i>
                Quản lý người dùng
              </h1>
              <p className="page-subtitle-admin">Quản lý tất cả người dùng trong hệ thống</p>
            </div>
            <Link to="/admin/users/new">
              <Button variant="primary" className="btn-add-user-admin">
                <i className="fas fa-user-plus me-2"></i>
                Thêm người dùng
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm theo tên, email, số điện thoại..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="restaurant_owner">Chủ nhà hàng</option>
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
                    <option value="active">Hoạt động</option>
                    <option value="locked">Đã khóa</option>
                    <option value="inactive">Không hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Không tìm thấy người dùng nào.
          </Alert>
        ) : (
          <Row>
            {filteredUsers.map((user) => (
              <Col md={6} lg={4} key={user.id} className="mb-4">
                <Card className="user-card-admin">
                  <Card.Body>
                    <div className="user-header-admin">
                      <div className="user-avatar-admin">
                        {user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="user-badges-admin">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                    <h5 className="user-name-admin">{user.fullName || user.username}</h5>
                    <div className="user-info-admin">
                      <p className="mb-1">
                        <i className="fas fa-user me-2 text-primary"></i>
                        {user.username}
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="mb-1">
                          <i className="fas fa-phone me-2 text-primary"></i>
                          {user.phone}
                        </p>
                      )}
                    </div>
                    <div className="user-actions-admin">
                      <Link to={`/admin/users/${user.id}/edit`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </Link>
                      <Button
                        variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        className="me-2"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      >
                        <i className={`fas fa-${user.status === 'active' ? 'lock' : 'unlock'}`}></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
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

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName || userToDelete?.username}</strong>?</p>
            <p className="text-danger">Hành động này không thể hoàn tác!</p>
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

export default AdminUsersPage;

