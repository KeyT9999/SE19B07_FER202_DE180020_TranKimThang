/**
 * RestaurantOwnerWithdrawalPage Component
 * Request withdrawal for restaurant owners
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerWithdrawalPage.css';

function RestaurantOwnerWithdrawalPage() {
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    bankAccount: '',
    bankName: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load balance and withdrawal history
      setBalance(0);
      setWithdrawals([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorWithTimeout('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (parseFloat(formData.amount) > balance) {
      setErrorWithTimeout('Số tiền vượt quá số dư.');
      return;
    }
    try {
      setSubmitting(true);
      // TODO: Submit withdrawal request
      setSuccessWithTimeout('Đã gửi yêu cầu rút tiền thành công.');
      setFormData({ amount: '', bankAccount: '', bankName: '' });
      await loadData();
    } catch (error) {
      setErrorWithTimeout('Không thể gửi yêu cầu rút tiền.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="restaurant-owner-withdrawal-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner"><i className="fas fa-money-bill-wave me-2"></i>Rút tiền</h1>
        </div>

        <Row>
          <Col lg={6}>
            <Card className="balance-card-owner mb-4">
              <Card.Header className="card-header-owner"><i className="fas fa-wallet me-2"></i>Số dư</Card.Header>
              <Card.Body>
                <h2 className="balance-amount-owner">{formatCurrency(balance)}</h2>
              </Card.Body>
            </Card>

            <Card className="form-card-owner">
              <Card.Header className="card-header-owner"><i className="fas fa-credit-card me-2"></i>Yêu cầu rút tiền</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số tiền (VNĐ) <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required min="1000" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số tài khoản <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="bankAccount" value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên ngân hàng <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} required />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={submitting} className="w-100">
                    {submitting ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="history-card-owner">
              <Card.Header className="card-header-owner"><i className="fas fa-history me-2"></i>Lịch sử rút tiền</Card.Header>
              <Card.Body>
                {withdrawals.length === 0 ? (
                  <p className="text-muted text-center">Chưa có lịch sử rút tiền</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Số tiền</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((w) => (
                        <tr key={w.id}>
                          <td>{formatCurrency(w.amount)}</td>
                          <td>{w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td><Badge bg={w.status === 'APPROVED' ? 'success' : w.status === 'PENDING' ? 'warning' : 'danger'}>{w.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerWithdrawalPage;

