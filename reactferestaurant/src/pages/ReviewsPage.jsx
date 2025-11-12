/**
 * ReviewsPage Component
 * Page displaying list of reviews
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/common/Loading';
import './ReviewsPage.css';

function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    loadReviews();
    if (restaurantId) {
      loadRestaurant();
    }
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error loading restaurant:', error);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      // TODO: Implement reviews API endpoint
      // For now, return empty array
      setReviews([]);
    } catch (error) {
      console.error('Error loading reviews:', error);
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
    <main className="reviews-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="page-header mb-4">
            <h1 className="page-title">
              <i className="fas fa-star me-2"></i>
              Đánh giá
            </h1>
            {restaurant && (
              <p className="page-subtitle">
                Đánh giá cho: <strong>{restaurant.restaurantName}</strong>
              </p>
            )}
          </div>

          {reviews.length === 0 ? (
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-star fa-3x text-muted mb-3"></i>
                <h5>Chưa có đánh giá nào</h5>
                <p className="text-muted">Chưa có đánh giá nào cho nhà hàng này.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {reviews.map((review) => (
                <Col key={review.reviewId} xs={12} className="mb-4">
                  <Card className="ds-card review-card">
                    <Card.Body>
                      <div className="review-header mb-3">
                        <div className="review-user">
                          <div className="review-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h6 className="review-user-name">{review.customerName || 'Khách hàng'}</h6>
                            <div className="review-rating">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                      
                      {review.images && review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                          ))}
                        </div>
                      )}
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

export default ReviewsPage;

