import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const MobileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMobileDetails();
  }, [id]);

  const fetchMobileDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/mobiles/${id}`);
      setMobile(response.data);
      setError(false);
    } catch (error) {
      console.error('Error fetching mobile details:', error);
      setError(true);
      setMobile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    alert(`${mobile.name} added to cart!`);
  };

  const handleFavourite = () => {
    alert(`${mobile.name} added to favourites!`);
  };

  const handleBackToList = () => {
    navigate('/mobiles');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Alert variant="info">Loading...</Alert>
      </Container>
    );
  }

  if (error || !mobile) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>404 - Not Found</h4>
          <p>Mobile with ID {id} not found.</p>
          <Button variant="primary" onClick={handleBackToList}>
            <FaArrowLeft className="me-2" />Back to List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <img
            src={mobile.image}
            alt={mobile.name}
            className="img-fluid rounded shadow"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Mobile+Image';
            }}
          />
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-end mb-3">
            <Badge bg="primary" style={{ fontSize: '1.5rem', padding: '10px 20px' }}>
              ${mobile.price.toFixed(2)}
            </Badge>
          </div>
          <h1 className="mb-4">{mobile.name}</h1>
          <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
            {mobile.desc}
          </p>
          <div className="d-grid gap-2">
            <Button variant="success" size="lg" onClick={handleAddToCart}>
              <FaShoppingCart className="me-2" />Add to Cart
            </Button>
            <Button variant="danger" size="lg" onClick={handleFavourite}>
              <FaHeart className="me-2" />Favourite
            </Button>
            <Button variant="secondary" size="lg" onClick={handleBackToList}>
              <FaArrowLeft className="me-2" />Back to List
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

MobileDetail.propTypes = {};

export default MobileDetail;
