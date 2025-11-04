import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MotorbikeAPI from "../api/MotorbikeAPI";
import { useCart } from "../contexts/CartContext";

function MotobikesList() {
  const [motobikes, setMotobikes] = useState([]);
  const [filteredMotobikes, setFilteredMotobikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fix image path for React public folder
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    // If path starts with 'img/', prepend '/' to access public folder
    if (imagePath.startsWith('img/')) {
      return `/${imagePath}`;
    }
    // If it's already a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, assume it's in public folder
    return `/${imagePath}`;
  };

  useEffect(() => {
    const fetchMotobikes = async () => {
      try {
        setLoading(true);
        const response = await MotorbikeAPI.get("/motobikes");
        console.log("Fetched motobikes:", response.data);
        setMotobikes(response.data);
        setFilteredMotobikes(response.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải danh sách motobikes:", err);
        setError(`Không thể tải danh sách motobikes. Vui lòng kiểm tra JSON Server có đang chạy trên port 3001 không. Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMotobikes();
  }, []);

  useEffect(() => {
    let filtered = [...motobikes];

    // Search by model
    if (searchTerm) {
      filtered = filtered.filter((motobike) =>
        motobike.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortOrder === "asc") {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d]/g, "").replace(/\./g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d]/g, "").replace(/\./g, ""));
        return priceA - priceB;
      });
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d]/g, "").replace(/\./g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d]/g, "").replace(/\./g, ""));
        return priceB - priceA;
      });
    }

    setFilteredMotobikes(filtered);
  }, [searchTerm, sortOrder, motobikes]);

  const handleAddToCart = async (motobike) => {
    if (motobike.quantity > 0) {
      try {
        // Decrease stock by 1
        await MotorbikeAPI.patch(`/motobikes/${motobike.id}`, {
          quantity: motobike.quantity - 1,
        });
        
        // Add to cart
        addToCart(motobike);
        
        // Show success message
        setSuccessMessage(`${motobike.name} has been added to your cart.`);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        
        // Update local state
        setMotobikes((prev) =>
          prev.map((item) =>
            item.id === motobike.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } catch (err) {
        console.error("Lỗi khi thêm vào giỏ hàng:", err);
        alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
    } else {
      alert("Sản phẩm đã hết hàng!");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Đang tải danh sách xe máy...</p>
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
      {/* Page Title */}
      <div className="text-center mb-4">
        <h1 className="display-5">Motorbike List</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Header with View Cart Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="info" onClick={() => navigate("/cart")}>
          View Cart
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>Search by model</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>Sort by Price</InputGroup.Text>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {filteredMotobikes.length === 0 ? (
        <Alert variant="info">No motorbikes found.</Alert>
      ) : (
        <Row>
          {filteredMotobikes.map((motobike) => {
            const imageSrc = getImageSrc(motobike.image);
            return (
              <Col key={motobike.id} md={6} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  {imageSrc && (
                    <Card.Img
                      variant="top"
                      src={imageSrc}
                      alt={motobike.name}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5">{motobike.name}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {motobike.year && (
                        <>
                          <strong>Year:</strong> {motobike.year}
                          <br />
                        </>
                      )}
                      <strong>Price:</strong> {motobike.price}
                      <br />
                      <strong>Stock:</strong> {motobike.quantity}
                    </Card.Text>
                    <div className="d-grid gap-2 mt-auto">
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/view/${motobike.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleAddToCart(motobike)}
                        disabled={motobike.quantity === 0}
                      >
                        Add to Cart
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

export default MotobikesList;
