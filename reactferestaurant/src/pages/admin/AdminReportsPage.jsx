/**
 * AdminReportsPage Component
 * Reports and analytics for admin
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminReportsPage.css';

let Chart;

function AdminReportsPage() {
  const { setErrorWithTimeout } = useApp();
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRestaurants: 0, totalBookings: 0, totalRevenue: 0 });
  const revenueChartRef = useRef(null);
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
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const usersRes = await api.get('/users');
      const restaurantsRes = await api.get('/restaurants');
      const bookingsRes = await api.get('/bookings');
      setStats({
        totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
        totalRestaurants: Array.isArray(restaurantsRes.data) ? restaurantsRes.data.length : 0,
        totalBookings: Array.isArray(bookingsRes.data) ? bookingsRes.data.length : 0,
        totalRevenue: 0,
      });
      if (Chart && revenueChartRef.current) {
        initializeCharts();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = () => {
    Object.values(chartInstances).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      const newInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: [5000000, 8000000, 6000000, 9000000, 7000000, 10000000, 8500000],
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
      setChartInstances({ revenue: newInstance });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading message="Đang tải báo cáo..." />;

  return (
    <div className="admin-reports-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-chart-bar me-2"></i>Báo cáo & Thống kê</h1>
        </div>

        <Card className="filter-card-admin mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary"><i className="fas fa-sync me-2"></i>Cập nhật</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng người dùng</h5>
                <h3 className="stat-value-admin text-primary">{stats.totalUsers}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng nhà hàng</h5>
                <h3 className="stat-value-admin text-success">{stats.totalRestaurants}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng đặt bàn</h5>
                <h3 className="stat-value-admin text-info">{stats.totalBookings}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card-admin">
              <Card.Body>
                <h5 className="stat-label-admin">Tổng doanh thu</h5>
                <h3 className="stat-value-admin text-warning">{formatCurrency(stats.totalRevenue)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="chart-card-admin">
          <Card.Header className="card-header-admin"><i className="fas fa-chart-line me-2"></i>Doanh thu theo ngày</Card.Header>
          <Card.Body>
            <canvas ref={revenueChartRef} height="200"></canvas>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminReportsPage;

