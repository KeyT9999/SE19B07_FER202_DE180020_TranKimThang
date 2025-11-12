/**
 * AdminVoucherAnalyticsPage Component
 * Voucher analytics for admin
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminVoucherAnalyticsPage.css';

let Chart;

function AdminVoucherAnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalUses: 0,
    totalRevenue: 0,
    averageDiscount: 0,
    topUsers: [],
  });
  const usageChartRef = useRef(null);
  const [chartInstances, setChartInstances] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined' && !Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = () => {
        Chart = window.Chart;
        loadData();
      };
      document.head.appendChild(script);
    } else {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (Chart && usageChartRef.current) {
      initializeCharts();
    }
  }, [analytics]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load voucher and analytics data
      setVoucher(null);
      setAnalytics({
        totalUses: 0,
        totalRevenue: 0,
        averageDiscount: 0,
        topUsers: [],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = () => {
    Object.values(chartInstances).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') chart.destroy();
    });

    if (usageChartRef.current) {
      const ctx = usageChartRef.current.getContext('2d');
      const newInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Số lần sử dụng',
            data: [5, 8, 12, 15, 10, 18, 14],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        },
      });
      setChartInstances({ usage: newInstance });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải thống kê..." />;

  return (
    <div className="admin-voucher-analytics-page">
      <Container>
        <div className="page-header-admin mb-4">
          <Button variant="link" onClick={() => navigate('/admin/vouchers')} className="back-button-admin">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-admin"><i className="fas fa-chart-bar me-2"></i>Thống kê voucher</h1>
          {voucher && <p className="page-subtitle-admin">Mã: {voucher.code}</p>}
        </div>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng số lần sử dụng</h5>
                <h3 className="stat-value-admin text-primary">{analytics.totalUses}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng doanh thu</h5>
                <h3 className="stat-value-admin text-success">{formatCurrency(analytics.totalRevenue)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Giảm giá trung bình</h5>
                <h3 className="stat-value-admin text-info">{formatCurrency(analytics.averageDiscount)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Người dùng</h5>
                <h3 className="stat-value-admin text-warning">{analytics.topUsers.length}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="chart-card-admin mb-4">
              <Card.Header className="card-header-admin"><i className="fas fa-chart-line me-2"></i>Sử dụng theo ngày</Card.Header>
              <Card.Body>
                <canvas ref={usageChartRef} height="200"></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="top-users-card-admin">
              <Card.Header className="card-header-admin"><i className="fas fa-users me-2"></i>Người dùng hàng đầu</Card.Header>
              <Card.Body>
                {analytics.topUsers.length === 0 ? (
                  <p className="text-muted text-center">Chưa có dữ liệu</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Người dùng</th>
                        <th>Số lần</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topUsers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td><Badge bg="primary">{user.count}</Badge></td>
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

export default AdminVoucherAnalyticsPage;

