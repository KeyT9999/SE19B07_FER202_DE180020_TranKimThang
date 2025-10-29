import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaEye, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MobileCard = ({ mobile }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/mobiles/${mobile.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart logic here
    alert(`${mobile.name} added to cart!`);
  };

  const handleFavourite = (e) => {
    e.stopPropagation();
    // Add to favourites logic here
    alert(`${mobile.name} added to favourites!`);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={mobile.image}
        style={{ height: '250px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x250?text=Mobile+Image';
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{mobile.name}</Card.Title>
        <Card.Text className="flex-grow-1">{mobile.desc}</Card.Text>
        <div className="mb-3">
          <Badge bg="primary" style={{ fontSize: '1.2rem', padding: '8px 12px' }}>
            ${mobile.price.toFixed(2)}
          </Badge>
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleViewDetails}>
            <FaEye className="me-2" />View Details
          </Button>
          <div className="d-flex gap-2">
            <Button variant="success" onClick={handleAddToCart} className="flex-fill">
              <FaShoppingCart className="me-2" />Add to Cart
            </Button>
            <Button variant="danger" onClick={handleFavourite}>
              <FaHeart />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

MobileCard.propTypes = {
  mobile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};

export default MobileCard;
