/**
 * RestaurantOwnerTablesPage Component
 * Manage tables for a restaurant
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerTablesPage.css';

function RestaurantOwnerTablesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableName: '',
    capacity: '',
    depositAmount: '',
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
      
      // Load tables
      const tablesRes = await api.get(`/tables?restaurantId=${id}`);
      const tablesData = Array.isArray(tablesRes.data) ? tablesRes.data : [];
      setTables(tablesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = () => {
    setEditingTable(null);
    setFormData({
      tableName: '',
      capacity: '',
      depositAmount: '',
      status: 'AVAILABLE',
    });
    setShowModal(true);
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setFormData({
      tableName: table.tableName || '',
      capacity: table.capacity || '',
      depositAmount: table.depositAmount || '',
      status: table.status || 'AVAILABLE',
    });
    setShowModal(true);
  };

  const handleSaveTable = async () => {
    try {
      setSaving(true);
      
      const tableData = {
        restaurantId: parseInt(id),
        tableName: formData.tableName,
        capacity: parseInt(formData.capacity),
        depositAmount: formData.depositAmount ? parseInt(formData.depositAmount) : 0,
        status: formData.status,
        mainImage: null,
        images: [],
      };

      if (editingTable) {
        // Update existing table
        const existing = await api.get(`/tables/${editingTable.id || editingTable.tableId}`);
        await api.put(`/tables/${editingTable.id || editingTable.tableId}`, {
          ...existing.data,
          ...tableData,
        });
        setSuccessWithTimeout('Đã cập nhật bàn thành công.');
      } else {
        // Create new table
        // Generate tableId
        const allTables = await api.get('/tables');
        const allTablesData = Array.isArray(allTables.data) ? allTables.data : [];
        const maxTableId = allTablesData.length > 0
          ? Math.max(...allTablesData.map(t => t.tableId || 0))
          : 0;
        
        tableData.tableId = maxTableId + 1;
        await api.post('/tables', tableData);
        setSuccessWithTimeout('Đã thêm bàn thành công.');
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving table:', error);
      setErrorWithTimeout('Không thể lưu bàn. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTable = async (table) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bàn ${table.tableName}?`)) {
      return;
    }

    try {
      await api.delete(`/tables/${table.id || table.tableId}`);
      setSuccessWithTimeout('Đã xóa bàn thành công.');
      await loadData();
    } catch (error) {
      console.error('Error deleting table:', error);
      setErrorWithTimeout('Không thể xóa bàn.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      AVAILABLE: { variant: 'success', text: 'Khả dụng' },
      RESERVED: { variant: 'warning', text: 'Đã đặt' },
      OCCUPIED: { variant: 'danger', text: 'Đang sử dụng' },
      CLEANING: { variant: 'info', text: 'Đang dọn dẹp' },
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

  if (loading) {
    return <Loading message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="restaurant-owner-tables-page">
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
                <i className="fas fa-table me-2"></i>
                Quản lý bàn - {restaurant?.restaurantName || 'Nhà hàng'}
              </h1>
              <p className="page-subtitle-owner">Quản lý các bàn trong nhà hàng</p>
            </div>
            <Button variant="success" onClick={handleAddTable}>
              <i className="fas fa-plus-circle me-2"></i>
              Thêm bàn mới
            </Button>
          </div>
        </div>

        {tables.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-table fa-3x text-muted mb-3"></i>
              <h5>Chưa có bàn nào</h5>
              <p className="text-muted mb-4">Thêm bàn đầu tiên cho nhà hàng của bạn!</p>
              <Button variant="success" onClick={handleAddTable}>
                <i className="fas fa-plus-circle me-2"></i>
                Thêm bàn mới
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {tables.map((table) => (
              <Col md={6} lg={4} key={table.tableId || table.id} className="mb-4">
                <Card className="table-card-owner">
                  <Card.Body>
                    <div className="table-header-owner">
                      <h5>{table.tableName}</h5>
                      {getStatusBadge(table.status)}
                    </div>
                    <div className="table-info-owner">
                      <p className="mb-2">
                        <i className="fas fa-chair me-2 text-primary"></i>
                        Sức chứa: <strong>{table.capacity}</strong> người
                      </p>
                      {table.depositAmount > 0 && (
                        <p className="mb-0">
                          <i className="fas fa-money-bill-wave me-2 text-success"></i>
                          Đặt cọc: <strong>{formatCurrency(table.depositAmount)}</strong>
                        </p>
                      )}
                    </div>
                    <div className="table-actions-owner">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditTable(table)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTable(table)}
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

        {/* Add/Edit Table Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên bàn <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.tableName}
                  onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                  placeholder="Bàn 1, Bàn VIP, ..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sức chứa <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tiền đặt cọc (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
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
                  <option value="RESERVED">Đã đặt</option>
                  <option value="OCCUPIED">Đang sử dụng</option>
                  <option value="CLEANING">Đang dọn dẹp</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveTable} disabled={saving || !formData.tableName || !formData.capacity}>
              {saving ? 'Đang lưu...' : editingTable ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default RestaurantOwnerTablesPage;

