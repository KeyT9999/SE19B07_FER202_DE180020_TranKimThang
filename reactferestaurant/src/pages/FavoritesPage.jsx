/**
 * FavoritesPage Component
 * Page displaying user's favorite restaurants
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import Loading from '../components/common/Loading';
import './FavoritesPage.css';

function FavoritesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setErrorWithTimeout } = useApp();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated, navigate, user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // TODO: Implement favorites API endpoint
      // For now, return empty array
      setFavorites([]);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setErrorWithTimeout('Không thể tải danh sách yêu thích.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (restaurantId) => {
    try {
      // TODO: Implement remove favorite API
      setFavorites(prev => prev.filter(fav => fav.restaurantId !== restaurantId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setErrorWithTimeout('Không thể xóa khỏi danh sách yêu thích.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="favorites-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <div className="page-header mb-4">
            <h1 className="page-title">
              <i className="fas fa-heart me-2"></i>
              Nhà hàng yêu thích
            </h1>
            <p className="page-subtitle">Danh sách nhà hàng bạn đã yêu thích</p>
          </div>

          {favorites.length === 0 ? (
            <Card className="ds-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5>Chưa có nhà hàng yêu thích</h5>
                <p className="text-muted">Bạn chưa thêm nhà hàng nào vào danh sách yêu thích.</p>
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
              {favorites.map((favorite) => (
                <Col key={favorite.restaurantId} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="ds-card favorite-card">
                    <div className="favorite-image-container">
                      <img
                        src={favorite.mainImageUrl || 'https://via.placeholder.com/300x200'}
                        alt={favorite.restaurantName}
                        className="favorite-image"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="favorite-remove-btn"
                        onClick={() => handleRemoveFavorite(favorite.restaurantId)}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                    <Card.Body>
                      <Card.Title className="favorite-title">
                        <Link to={`/restaurants/${favorite.restaurantId}`}>
                          {favorite.restaurantName}
                        </Link>
                      </Card.Title>
                      <div className="favorite-rating">
                        <i className="fas fa-star text-warning"></i>
                        <span>{favorite.averageRating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-muted ms-2">
                          ({favorite.reviewCount || 0} đánh giá)
                        </span>
                      </div>
                      <p className="favorite-address text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {favorite.address}
                      </p>
                      <Link to={`/restaurants/${favorite.restaurantId}`}>
                        <Button variant="primary" className="w-100">
                          Xem chi tiết
                        </Button>
                      </Link>
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

export default FavoritesPage;

