/**
 * MyReviewsPage Component
 * Page displaying user's own reviews
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Loading from '../components/common/Loading';
import './MyReviewsPage.css';

function MyReviewsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout } = useApp();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadMyReviews();
  }, [isAuthenticated, navigate, user]);

  const loadMyReviews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // TODO: Implement my reviews API endpoint
      // For now, return empty array
      setReviews([]);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setErrorWithTimeout('Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="my-reviews-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="page-header mb-4">
            <h1 className="page-title">
              <i className="fas fa-star me-2"></i>
              Đánh giá của tôi
            </h1>
            <p className="page-subtitle">Xem và quản lý các đánh giá bạn đã viết</p>
          </div>

          {reviews.length === 0 ? (
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-star fa-3x text-muted mb-3"></i>
                <h5>Chưa có đánh giá nào</h5>
                <p className="text-muted">Bạn chưa viết đánh giá nào. Hãy đánh giá nhà hàng bạn đã đến!</p>
                <Link to="/restaurants">
                  <Button variant="primary">
                    <i className="fas fa-search me-2"></i>
                    Tìm nhà hàng
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {reviews.map((review) => (
                <Col key={review.reviewId} xs={12} className="mb-4">
                  <Card className="ds-card review-card">
                    <Card.Body>
                      <div className="review-header mb-3">
                        <div>
                          <h6 className="review-restaurant-name">
                            <Link to={`/restaurants/${review.restaurantId}`}>
                              {review.restaurantName}
                            </Link>
                          </h6>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                      
                      <div className="review-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement edit review
                            alert('Tính năng chỉnh sửa đánh giá sẽ được triển khai');
                          }}
                        >
                          <i className="fas fa-edit me-2"></i>
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement delete review
                            alert('Tính năng xóa đánh giá sẽ được triển khai');
                          }}
                        >
                          <i className="fas fa-trash me-2"></i>
                          Xóa
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
}

export default MyReviewsPage;

