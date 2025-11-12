/**
 * RestaurantOwnerAnalyticsPage Component
 * Analytics and reports for restaurant owners with charts
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerAnalyticsPage.css';

// Chart.js will be loaded via CDN
let Chart;

function RestaurantOwnerAnalyticsPage() {
  const { setErrorWithTimeout } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('month');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgGuestsPerBooking: 0,
    fillRate: 0,
  });

  const revenueChartRef = useRef(null);
  const bookingsChartRef = useRef(null);
  const customerGroupChartRef = useRef(null);
  const cancellationChartRef = useRef(null);
  const [chartInstances, setChartInstances] = useState({});

  useEffect(() => {
    // Load Chart.js from CDN
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

  useEffect(() => {
    if (Chart) {
      loadData();
    }
  }, [selectedRestaurant, dateFrom, dateTo, period]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurants
      const restaurantsRes = await api.get('/restaurants');
      const restaurantsData = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      setRestaurants(restaurantsData);
      
      // Load bookings for stats
      const bookingsRes = await api.get('/bookings');
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      
      // Filter bookings by restaurant and date
      let filteredBookings = bookings;
      if (selectedRestaurant !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.restaurantId === parseInt(selectedRestaurant));
      }
      
      // Calculate stats
      const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);
      const totalBookings = filteredBookings.length;
      const totalGuests = filteredBookings.reduce((sum, b) => sum + (b.numberOfGuests || 0), 0);
      const avgGuestsPerBooking = totalBookings > 0 ? (totalGuests / totalBookings).toFixed(1) : 0;
      
      // Mock fill rate (in real app, calculate from table capacity)
      const fillRate = 78;
      
      setStats({
        totalRevenue,
        totalBookings,
        avgGuestsPerBooking: parseFloat(avgGuestsPerBooking),
        fillRate,
      });
      
      // Initialize charts
      if (Chart) {
        initializeCharts(filteredBookings);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = (bookings) => {
    // Destroy existing charts
    Object.values(chartInstances).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });

    const newInstances = {};

    // Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      newInstances.revenue = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: [1200000, 1800000, 1500000, 2100000, 1900000, 2500000, 2200000],
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(context.parsed.y);
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => {
                  return (value / 1000000).toFixed(1) + 'M';
                },
              },
            },
          },
        },
      });
    }

    // Bookings Chart
    if (bookingsChartRef.current) {
      const ctx = bookingsChartRef.current.getContext('2d');
      newInstances.bookings = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['11:00', '12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00'],
          datasets: [{
            label: 'Số đặt bàn',
            data: [3, 8, 5, 4, 12, 15, 10, 6],
            backgroundColor: '#007bff',
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Customer Group Chart
    if (customerGroupChartRef.current) {
      const ctx = customerGroupChartRef.current.getContext('2d');
      newInstances.customerGroup = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['1-2 người', '3-4 người', '5-6 người', '7+ người'],
          datasets: [{
            data: [156, 134, 42, 10],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    // Cancellation Chart
    if (cancellationChartRef.current) {
      const ctx = cancellationChartRef.current.getContext('2d');
      newInstances.cancellation = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Đã xác nhận', 'Đã hủy', 'No Show'],
          datasets: [{
            data: [280, 45, 17],
            backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    setChartInstances(newInstances);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <Loading message="Đang tải dữ liệu thống kê..." />;
  }

  return (
    <div className="restaurant-owner-analytics-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className="fas fa-chart-line me-2"></i>
            Báo cáo & Thống kê
          </h1>
          <p className="page-subtitle-owner">
            Phân tích hiệu suất kinh doanh và xu hướng khách hàng
          </p>
        </div>

        {/* Date Range Selector */}
        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Khoảng thời gian</Form.Label>
                  <Form.Select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                    <option value="year">Năm nay</option>
                    <option value="custom">Tùy chỉnh</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Nhà hàng</Form.Label>
                  <Form.Select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                  >
                    <option value="all">Tất cả nhà hàng</option>
                    {restaurants.map(r => (
                      <option key={r.restaurantId} value={r.restaurantId}>
                        {r.restaurantName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3">
              <Button variant="primary" className="me-2">
                <i className="fas fa-sync me-1"></i>
                Cập nhật
              </Button>
              <Button variant="outline-secondary">
                <i className="fas fa-file-export me-1"></i>
                Xuất báo cáo
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="metric-card-owner">
              <Card.Body>
                <h5 className="metric-label-owner">Tổng doanh thu</h5>
                <h3 className="metric-value-owner text-success">
                  {formatCurrency(stats.totalRevenue)}
                </h3>
                <small className="text-success">+12.5% so với tháng trước</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card-owner">
              <Card.Body>
                <h5 className="metric-label-owner">Số đặt bàn</h5>
                <h3 className="metric-value-owner text-primary">
                  {stats.totalBookings}
                </h3>
                <small className="text-primary">+8.3% so với tháng trước</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card-owner">
              <Card.Body>
                <h5 className="metric-label-owner">Khách trung bình/bàn</h5>
                <h3 className="metric-value-owner text-warning">
                  {stats.avgGuestsPerBooking}
                </h3>
                <small className="text-warning">+0.1 so với tháng trước</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card-owner">
              <Card.Body>
                <h5 className="metric-label-owner">Tỷ lệ lấp đầy</h5>
                <h3 className="metric-value-owner text-danger">
                  {stats.fillRate}%
                </h3>
                <small className="text-danger">-2.1% so với tháng trước</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="chart-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-chart-line me-2"></i>
                Doanh thu theo ngày
              </Card.Header>
              <Card.Body>
                <canvas ref={revenueChartRef} height="200"></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-calendar-alt me-2"></i>
                Đặt bàn theo giờ
              </Card.Header>
              <Card.Body>
                <canvas ref={bookingsChartRef} height="200"></canvas>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="chart-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-users me-2"></i>
                Phân bố khách theo nhóm
              </Card.Header>
              <Card.Body>
                <canvas ref={customerGroupChartRef} height="200"></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card-owner">
              <Card.Header className="card-header-owner">
                <i className="fas fa-ban me-2"></i>
                Tỷ lệ hủy đặt bàn
              </Card.Header>
              <Card.Body>
                <canvas ref={cancellationChartRef} height="200"></canvas>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Detailed Reports Table */}
        <Card className="reports-card-owner">
          <Card.Header className="card-header-owner">
            <i className="fas fa-table me-2"></i>
            Báo cáo chi tiết
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Doanh thu</th>
                  <th>Số đặt bàn</th>
                  <th>Trung bình/đặt bàn</th>
                  <th>So với ngày trước</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>29/01/2025</td>
                  <td>{formatCurrency(2100000)}</td>
                  <td>18</td>
                  <td>{formatCurrency(116000)}</td>
                  <td className="text-success">+15%</td>
                </tr>
                <tr>
                  <td>28/01/2025</td>
                  <td>{formatCurrency(1800000)}</td>
                  <td>15</td>
                  <td>{formatCurrency(120000)}</td>
                  <td className="text-danger">-8%</td>
                </tr>
                <tr>
                  <td>27/01/2025</td>
                  <td>{formatCurrency(2000000)}</td>
                  <td>17</td>
                  <td>{formatCurrency(118000)}</td>
                  <td className="text-success">+12%</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RestaurantOwnerAnalyticsPage;

