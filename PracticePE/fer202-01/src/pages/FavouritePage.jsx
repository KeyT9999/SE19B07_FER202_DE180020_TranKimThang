import React from "react";
import { Container, Row, Col, Card, Button, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFavourite } from "../context/FavouriteContext";
import PropTypes from "prop-types";

function FavouritePage() {
  const { items, removeFromFavourite } = useFavourite();
  const navigate = useNavigate();

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('img/')) {
      return `/${imagePath}`;
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price / 23000);
    }
    return price;
  };

  if (items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Your favourites list is empty</Alert.Heading>
          <p>Add some mobiles to your favourites to see them here.</p>
          <Button variant="primary" onClick={() => navigate("/mobiles")}>
            Browse Mobiles
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Favourites</h1>
      </div>

      <Row>
        {items.map((mobile) => {
          const imageSrc = getImageSrc(mobile.image);
          const formattedPrice = formatPrice(mobile.price);
          
          return (
            <Col key={mobile.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                {imageSrc && (
                  <Card.Img
                    variant="top"
                    src={imageSrc}
                    alt={mobile.name}
                    style={{ height: "300px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h4 mb-3" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{mobile.name}</Card.Title>
                  <Card.Text className="flex-grow-1 mb-3" style={{ color: "#666", fontSize: "1rem", lineHeight: "1.6" }}>
                    {mobile.description?.substring(0, 100)}...
                  </Card.Text>
                  <div className="mb-3">
                    <Badge bg="primary" style={{ fontSize: "1.2rem", padding: "10px 24px" }}>
                      {formattedPrice}
                    </Badge>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/mobiles/${mobile.id}`)}
                      style={{ borderRadius: "8px", fontSize: "1rem", padding: "10px" }}
                    >
                      👁️ View Details
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeFromFavourite(mobile.id)}
                      style={{ borderRadius: "8px", fontSize: "1rem", padding: "10px" }}
                    >
                      ❌ Remove from Favourites
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

FavouritePage.propTypes = {};

export default FavouritePage;

