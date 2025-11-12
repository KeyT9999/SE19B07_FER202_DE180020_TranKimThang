/**
 * RestaurantDetailPage Component
 * Luxury restaurant detail page with hero section, gallery, and comprehensive information
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert, Row, Col, Badge, Card } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaStar, FaMapMarkerAlt, FaPhone, FaClock, FaDollarSign, FaUtensils, FaWifi, FaParking, FaMusic, FaWheelchair, FaHeart, FaShareAlt, FaImages, FaExternalLinkAlt } from 'react-icons/fa';
import RestaurantDetail from '../components/restaurant/RestaurantDetail';
import TableSelector from '../components/restaurant/TableSelector';
import ServicesList from '../components/restaurant/ServicesList';
import { getRestaurantById } from '../services/restaurantService';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { formatCurrency } from '../utils/formatters';
import './RestaurantDetailPage.css';

function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const { setErrorWithTimeout } = useApp();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        const errorMessage = 'Không thể tải thông tin nhà hàng. Vui lòng thử lại.';
        setError(errorMessage);
        setErrorWithTimeout(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, setErrorWithTimeout]);

  const handleBookTable = () => {
    navigate(`/booking/new`, {
      state: {
        restaurantId: id,
        restaurantName: restaurant?.restaurantName,
        selectedTables,
        selectedServices,
      },
    });
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite API
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="rating-stars">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} className="star filled" />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStar key={i} className="star half" />;
          } else {
            return <FaStar key={i} className="star" />;
          }
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="restaurant-detail-page">
        <Loading message="Đang tải thông tin nhà hàng..." />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-detail-page">
        <Container>
          <Alert variant="danger">
            {error || 'Nhà hàng không tồn tại'}
          </Alert>
          <Button variant="primary" onClick={() => navigate('/restaurants')} className="mt-3">
            <FaArrowLeft className="me-2" />
            Quay lại danh sách
          </Button>
        </Container>
      </div>
    );
  }

  // Generate gallery images (mock data for now)
  const galleryImages = [
    restaurant.mainImageUrl,
    restaurant.mainImageUrl,
    restaurant.mainImageUrl,
    restaurant.mainImageUrl,
    restaurant.mainImageUrl,
  ].filter(Boolean);

  return (
    <div className="restaurant-detail-page luxury">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div 
          className="hero-image"
          style={{
            backgroundImage: `url(${restaurant.mainImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})`
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <Container>
              <Button
                variant="outline-light"
                className="back-button mb-4"
                onClick={() => navigate('/restaurants')}
              >
                <FaArrowLeft className="me-2" />
                Quay lại
              </Button>
              
              <div className="hero-info">
                <div className="hero-badges mb-3">
                  {restaurant.cuisineType && (
                    <Badge bg="light" text="dark" className="me-2">
                      <FaUtensils className="me-1" />
                      {restaurant.cuisineType}
                    </Badge>
                  )}
                  {restaurant.averageRating >= 4.5 && (
                    <Badge bg="danger" className="me-2">HOT</Badge>
                  )}
                </div>
                
                <h1 className="hero-title">{restaurant.restaurantName}</h1>
                
                <div className="hero-rating mb-3">
                  {renderStars(restaurant.averageRating || 0)}
                  <span className="rating-value ms-2">
                    {restaurant.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="rating-count ms-2">
                    ({restaurant.reviewCount || 0} đánh giá)
                  </span>
                </div>

                <div className="hero-actions">
                  <Button
                    variant={isFavorite ? "danger" : "outline-light"}
                    className="me-2"
                    onClick={handleToggleFavorite}
                  >
                    <FaHeart className={isFavorite ? "filled" : ""} />
                  </Button>
                  <Button variant="outline-light" className="me-2">
                    <FaShareAlt />
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="book-now-button"
                    onClick={handleBookTable}
                  >
                    <FaCalendarAlt className="me-2" />
                    Đặt bàn ngay
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>

      <Container className="restaurant-content">
        {/* Quick Info Bar */}
        <Card className="quick-info-card mb-4">
          <Card.Body>
            <Row className="g-4">
              <Col xs={12} sm={6} md={3}>
                <div className="quick-info-item">
                  <FaMapMarkerAlt className="quick-info-icon" />
                  <div>
                    <div className="quick-info-label">Địa chỉ</div>
                    <div className="quick-info-value">{restaurant.address || 'N/A'}</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="quick-info-item">
                  <FaPhone className="quick-info-icon" />
                  <div>
                    <div className="quick-info-label">Điện thoại</div>
                    <div className="quick-info-value">{restaurant.phone || 'N/A'}</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="quick-info-item">
                  <FaClock className="quick-info-icon" />
                  <div>
                    <div className="quick-info-label">Giờ mở cửa</div>
                    <div className="quick-info-value">{restaurant.openingHours || 'N/A'}</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="quick-info-item">
                  <FaDollarSign className="quick-info-icon" />
                  <div>
                    <div className="quick-info-label">Giá trung bình</div>
                    <div className="quick-info-value">
                      {restaurant.averagePrice ? formatCurrency(restaurant.averagePrice) : 'N/A'}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <Card className="gallery-card mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="section-title mb-0">
                  <FaImages className="me-2" />
                  Hình ảnh
                </h3>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowGallery(!showGallery)}
                >
                  {showGallery ? 'Thu gọn' : 'Xem tất cả'}
                </Button>
              </div>
              <div className={`gallery-grid ${showGallery ? 'expanded' : ''}`}>
                {galleryImages.slice(0, showGallery ? galleryImages.length : 5).map((img, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={img} alt={`Gallery ${idx + 1}`} />
                    <div className="gallery-overlay">
                      <Button variant="light" size="sm">
                        <FaImages /> Xem lớn
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Tabs Section */}
        <div className="tabs-section">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button
              className={`tab-button ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              Bàn ăn
            </button>
            <button
              className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Dịch vụ
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({restaurant.reviewCount || 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'overview' && (
              <Card className="tab-content-card">
                <Card.Body>
                  <div className="overview-section">
                    <h4 className="section-subtitle mb-3">Mô tả</h4>
                    <p className="restaurant-description-luxury">
                      {restaurant.description || 'Chưa có mô tả cho nhà hàng này.'}
                    </p>

                    <div className="amenities-section mt-4">
                      <h4 className="section-subtitle mb-3">Tiện ích</h4>
                      <Row className="g-3">
                        <Col xs={6} sm={4} md={3}>
                          <div className="amenity-item">
                            <FaWifi className="amenity-icon" />
                            <span>WiFi miễn phí</span>
                          </div>
                        </Col>
                        <Col xs={6} sm={4} md={3}>
                          <div className="amenity-item">
                            <FaParking className="amenity-icon" />
                            <span>Chỗ đậu xe</span>
                          </div>
                        </Col>
                        <Col xs={6} sm={4} md={3}>
                          <div className="amenity-item">
                            <FaMusic className="amenity-icon" />
                            <span>Nhạc sống</span>
                          </div>
                        </Col>
                        <Col xs={6} sm={4} md={3}>
                          <div className="amenity-item">
                            <FaWheelchair className="amenity-icon" />
                            <span>Thân thiện người khuyết tật</span>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {restaurant.websiteUrl && (
                      <div className="website-section mt-4">
                        <h4 className="section-subtitle mb-3">Website</h4>
                        <a
                          href={restaurant.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-link-luxury"
                        >
                          {restaurant.websiteUrl}
                          <FaExternalLinkAlt className="ms-2" />
                        </a>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'tables' && (
              <Card className="tab-content-card">
                <Card.Body>
                  <TableSelector
                    restaurantId={restaurant.restaurantId}
                    selectedTables={selectedTables}
                    onTableSelect={setSelectedTables}
                  />
                </Card.Body>
              </Card>
            )}

            {activeTab === 'services' && (
              <Card className="tab-content-card">
                <Card.Body>
                  <ServicesList
                    restaurantId={restaurant.restaurantId}
                    selectedServices={selectedServices}
                    onServiceToggle={setSelectedServices}
                  />
                </Card.Body>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="tab-content-card">
                <Card.Body>
                  <div className="reviews-section">
                    <div className="reviews-summary mb-4">
                      <div className="reviews-rating-large">
                        <div className="rating-number">{restaurant.averageRating?.toFixed(1) || 'N/A'}</div>
                        {renderStars(restaurant.averageRating || 0)}
                        <div className="rating-text">
                          Dựa trên {restaurant.reviewCount || 0} đánh giá
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-5">
                      <p className="text-muted">Chức năng đánh giá đang được phát triển.</p>
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/reviews?restaurantId=${restaurant.restaurantId}`)}
                      >
                        Xem tất cả đánh giá
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>

        {/* Fixed Booking Button (Mobile) */}
        <div className="fixed-booking-button">
          <Button
            variant="primary"
            size="lg"
            className="w-100"
            onClick={handleBookTable}
          >
            <FaCalendarAlt className="me-2" />
            Đặt bàn ngay
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default RestaurantDetailPage;
