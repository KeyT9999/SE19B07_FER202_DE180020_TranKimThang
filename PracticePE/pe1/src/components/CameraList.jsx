import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CameraAPI from "../api/CameraAPI";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";

function CameraList() {
  const [cameras, setcameras] = useState([]);
  const [filteredcameras, setFilteredcameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToFavourite, isFavourite } = useFavourite();

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

  useEffect(() => {
    const fetchcameras = async () => {
      try {
        setLoading(true);
        const response = await CameraAPI.get("/cameras");
        setcameras(response.data);
        setFilteredcameras(response.data);
        setError(null);
      } catch (err) {
        setError(`Không thể tải danh sách cameras. Vui lòng kiểm tra JSON Server có đang chạy trên port 3001 không. Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchcameras();
  }, []);

  useEffect(() => {
    let filtered = [...cameras];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter((camera) =>
        camera.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by name or price
    if (sortOrder === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "price-asc") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^\d]/g, "").replace(/\./g, ""));
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^\d]/g, "").replace(/\./g, ""));
        return priceA - priceB;
      });
    } else if (sortOrder === "price-desc") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^\d]/g, "").replace(/\./g, ""));
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^\d]/g, "").replace(/\./g, ""));
        return priceB - priceA;
      });
    }

    setFilteredcameras(filtered);
  }, [searchTerm, sortOrder, cameras]);

  const handleAddToCamera = (camera) => {
    addToCart(camera);
    setSuccessMessage(`${camera.name} has been added to your cart.`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleFavourite = (camera) => {
    if (isFavourite(camera.id)) {
      setSuccessMessage(`${camera.name} is already in your favourites.`);
    } else {
      addToFavourite(camera);
      setSuccessMessage(`${camera.name} has been added to your favourites.`);
    }
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Đang tải danh sách điện thoại...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Lỗi!</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>
              Hãy đảm bảo JSON Server đang chạy: <code>json-server --watch db.json --port 3001</code>
            </small>
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Products</h1>
      </div>

      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>📊</InputGroup.Text>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {filteredcameras.length === 0 ? (
        <Alert variant="info">No cameras found.</Alert>
      ) : (
        <Row>
          {filteredcameras.map((camera) => {
            const imageSrc = getImageSrc(camera.image);
            const formattedPrice = typeof camera.price === 'number' 
              ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(camera.price / 23000)
              : camera.price;
            return (
              <Col key={camera.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  {imageSrc && (
                    <Card.Img
                      variant="top"
                      src={imageSrc}
                      alt={camera.name}
                      style={{ height: "300px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 mb-2">{camera.name}</Card.Title>
                    <Card.Text className="flex-grow-1 mb-3" style={{ color: "#666", fontSize: "0.9rem" }}>
                      {camera.description?.substring(0, 80)}...
                    </Card.Text>
                    <div className="mb-3">
                      <Button variant="primary" disabled style={{ borderRadius: "20px", padding: "8px 20px" }}>
                        {formattedPrice}
                      </Button>
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/cameras/${camera.id}`)}
                        style={{ borderRadius: "8px" }}
                      >
                        👁️ View Details
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleAddToCamera(camera)}
                        style={{ borderRadius: "8px" }}
                      >
                        🛒 Add to Camera
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleFavourite(camera)}
                        style={{ borderRadius: "8px" }}
                      >
                        {isFavourite(camera.id) ? "❤️ Favourited" : "❤️ Favourite"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default CameraList;
