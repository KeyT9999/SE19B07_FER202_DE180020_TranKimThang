import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Button, Row, Col, Badge, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import PhoneAPI from "../api/PhoneAPI";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import PropTypes from "prop-types";

function ViewPhone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { addToFavourite, isFavourite, removeFromFavourite } = useFavourite();

  useEffect(() => {
    const fetchMobile = async () => {
      if (!id) {
        setError("No mobile ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setImageError(false);
        
        const response = await PhoneAPI.get(`/mobiles/${id}`);
        
        if (response.data) {
          setMobile(response.data);
        } else {
          navigate("/404");
          return;
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate("/404");
          return;
        } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError("Cannot connect to JSON Server. Please make sure JSON Server is running: json-server --watch db.json --port 3001");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMobile();
  }, [id, navigate]);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('img/')) {
      return `/${imagePath}`;
    }
    return `/${imagePath}`;
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
  };

  const handleAddToCart = () => {
    if (mobile) {
      addToCart(mobile);
      alert(`${mobile.name} has been added to your cart.`);
    }
  };

  const handleFavourite = () => {
    if (mobile) {
      if (isFavourite(mobile.id)) {
        removeFromFavourite(mobile.id);
        alert(`${mobile.name} has been removed from your favourites.`);
      } else {
        addToFavourite(mobile);
        alert(`${mobile.name} has been added to your favourites.`);
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading mobile details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => navigate("/mobiles")}>
              Back to Mobile List
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!mobile) {
    return null;
  }

  const imageSrc = getImageSrc(mobile.image);
  const formattedPrice = typeof mobile.price === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(mobile.price / 23000)
    : mobile.price;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mb-4">
          <Card style={{ border: "none" }}>
            {imageSrc && !imageError ? (
              <Card.Img
                variant="top"
                src={imageSrc}
                alt={mobile.name || "Mobile"}
                style={{ height: "500px", objectFit: "cover", borderRadius: "12px" }}
                onError={handleImageError}
              />
            ) : (
              <div style={{ 
                width: "100%", 
                height: "500px", 
                backgroundColor: "#f0f0f0", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                border: "1px solid #ddd",
                borderRadius: "12px"
              }}>
                <p className="mb-2">No Image Available</p>
                <small className="text-muted">Path: {mobile.image || "Not provided"}</small>
              </div>
            )}
          </Card>
        </Col>
        
        <Col md={6}>
          <div style={{ paddingLeft: "2rem" }}>
            <Badge bg="primary" style={{ fontSize: "1.2rem", padding: "10px 20px", marginBottom: "1rem" }}>
              {formattedPrice}
            </Badge>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
              {mobile.name || "Unknown Mobile"}
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
              {mobile.description || "N/A"}
            </p>
            <div className="d-flex flex-column gap-3" style={{ maxWidth: "400px" }}>
              <Button
                variant="success"
                size="lg"
                onClick={handleAddToCart}
                style={{ borderRadius: "8px", padding: "12px" }}
              >
                🛒 Add to Cart
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={handleFavourite}
                style={{ 
                  borderRadius: "8px", 
                  padding: "12px",
                  borderColor: "#dc3545",
                  color: "#dc3545"
                }}
              >
                {isFavourite(mobile.id) ? "❤️ Favourited" : "❤️ Favourite"}
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate("/mobiles")}
                style={{ borderRadius: "8px", padding: "12px" }}
              >
                ← Back to List
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

ViewPhone.propTypes = {};

export default ViewPhone;

