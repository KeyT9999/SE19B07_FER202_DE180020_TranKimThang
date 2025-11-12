/**
 * RestaurantOwnerReviewsPage Component
 * Manage reviews for restaurant owner's restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerReviewsPage.css';

function RestaurantOwnerReviewsPage() {
  const { id } = useParams(); // restaurantId (optional)
  const navigate = useNavigate();
  const { setErrorWithTimeout, setSuccessWithTimeout } = useApp();
  
  const [restaurant, setRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(id || 'all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, selectedRestaurant, ratingFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurants
      const restaurantsRes = await api.get('/restaurants');
      const restaurantsData = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      setRestaurants(restaurantsData);
      
      // Load restaurant if id provided
      if (id) {
        try {
          const resRes = await api.get(`/restaurants/${id}`);
          setRestaurant(resRes.data);
        } catch (e) {
          const found = restaurantsData.find(r => r.restaurantId === parseInt(id));
          if (found) setRestaurant(found);
        }
      }
      
      // Load reviews (mock - JSON Server doesn't have reviews endpoint)
      // In real app, this would be: api.get(`/reviews?restaurantId=${id}`)
      const reviewsData = []; // Mock data
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorWithTimeout('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Restaurant filter
    if (selectedRestaurant !== 'all') {
      const restaurantId = parseInt(selectedRestaurant);
      filtered = filtered.filter(review => review.restaurantId === restaurantId);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    setFilteredReviews(filtered);
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      setErrorWithTimeout('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    try {
      // TODO: Call API to save reply
      setSuccessWithTimeout('Đã gửi phản hồi thành công.');
      setReplyingTo(null);
      setReplyText('');
      await loadData();
    } catch (error) {
      console.error('Error replying to review:', error);
      setErrorWithTimeout('Không thể gửi phản hồi.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  if (loading) {
    return <Loading message="Đang tải đánh giá..." />;
  }

  return (
    <div className="restaurant-owner-reviews-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner">
            <i className="fas fa-star me-2"></i>
            Quản lý đánh giá
          </h1>
          <p className="page-subtitle-owner">
            {restaurant ? `Đánh giá cho ${restaurant.restaurantName}` : 'Xem và trả lời đánh giá của khách hàng'}
          </p>
        </div>

        {/* Filters */}
        <Card className="filter-card-owner mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
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
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Đánh giá</Form.Label>
                  <Form.Select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <Card className="empty-state-card-owner">
            <Card.Body className="text-center py-5">
              <i className="fas fa-star fa-3x text-muted mb-3"></i>
              <h5>Chưa có đánh giá nào</h5>
              <p className="text-muted">Khách hàng chưa để lại đánh giá cho nhà hàng của bạn.</p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {filteredReviews.map((review) => (
              <Col md={12} key={review.reviewId || review.id} className="mb-4">
                <Card className="review-card-owner">
                  <Card.Body>
                    <div className="review-header-owner">
                      <div>
                        <h5 className="review-customer-name-owner">
                          {review.customerName || 'Khách hàng'}
                        </h5>
                        <div className="review-rating-owner mb-2">
                          {renderStars(review.rating || 5)}
                        </div>
                        <p className="review-date-owner text-muted">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                        </p>
                      </div>
                      <Badge bg="info">{review.rating || 5} sao</Badge>
                    </div>
                    
                    <div className="review-content-owner">
                      <p className="review-comment-owner">{review.comment || review.content}</p>
                    </div>

                    {review.reply && (
                      <div className="review-reply-owner">
                        <div className="reply-header-owner">
                          <strong>Phản hồi từ nhà hàng:</strong>
                        </div>
                        <p className="reply-content-owner">{review.reply}</p>
                      </div>
                    )}

                    {!review.reply && (
                      <div className="review-actions-owner">
                        {replyingTo === review.reviewId ? (
                          <div className="reply-form-owner">
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Nhập phản hồi của bạn..."
                              className="mb-2"
                            />
                            <div>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleReply(review.reviewId)}
                              >
                                <i className="fas fa-paper-plane me-1"></i>
                                Gửi phản hồi
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setReplyingTo(review.reviewId)}
                          >
                            <i className="fas fa-reply me-1"></i>
                            Trả lời đánh giá
                          </Button>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Statistics Summary */}
        {restaurant && (
          <Card className="stats-card-owner mt-4">
            <Card.Header className="card-header-owner">
              <i className="fas fa-chart-bar me-2"></i>
              Thống kê đánh giá
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="stat-item-owner">
                    <div className="stat-value-owner">{restaurant.averageRating?.toFixed(1) || '0.0'}</div>
                    <div className="stat-label-owner">Điểm trung bình</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item-owner">
                    <div className="stat-value-owner">{restaurant.reviewCount || 0}</div>
                    <div className="stat-label-owner">Tổng số đánh giá</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item-owner">
                    <div className="stat-value-owner">
                      {reviews.filter(r => r.rating >= 4).length}
                    </div>
                    <div className="stat-label-owner">Đánh giá tích cực</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item-owner">
                    <div className="stat-value-owner">
                      {reviews.filter(r => r.rating <= 2).length}
                    </div>
                    <div className="stat-label-owner">Đánh giá tiêu cực</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default RestaurantOwnerReviewsPage;

