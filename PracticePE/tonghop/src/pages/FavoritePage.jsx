/**
 * FavoritePage.jsx - Trang hiển thị danh sách yêu thích
 * 
 * MỤC ĐÍCH:
 * - Hiển thị danh sách sản phẩm yêu thích dạng card
 * - Cho phép user xem chi tiết, xóa khỏi yêu thích
 * 
 * ROUTE: /favourites
 * CONTEXTS: FavoriteContext (items, removeFromFavorite)
 */

import React from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useFavorite } from "../context/FavoriteContext";
import { formatPrice } from "../utils/format";
import { assetUrl } from "../utils/format";

function FavoritePage() {
  // Lấy state và functions từ FavoriteContext
  const { items, removeFromFavorite } = useFavorite();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Danh sách yêu thích của bạn đang trống</Alert.Heading>
          <p>Thêm một số sản phẩm vào danh sách yêu thích để xem chúng ở đây.</p>
          <Button variant="primary" onClick={() => navigate("/products")}>
            Xem sản phẩm
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "1200px" }}>
      <div className="mb-4">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Danh sách yêu thích</h1>
      </div>

      <Row>
        {items.map((product) => {
          return (
            <Col key={product.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={assetUrl(product.image)}
                  alt={product.name}
                  style={{ height: "300px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h4 mb-3" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {product.name}
                  </Card.Title>
                  <Card.Text className="flex-grow-1 mb-3" style={{ color: "#666", fontSize: "1rem", lineHeight: "1.6" }}>
                    {product.description?.substring(0, 100)}
                    {product.description && product.description.length > 100 ? "..." : ""}
                  </Card.Text>
                  <div className="mb-3">
                    <span className="text-success fw-bold" style={{ fontSize: "1.3rem" }}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      as={Link}
                      to={`/product/${product.id}`}
                      variant="primary"
                      style={{ borderRadius: "8px", fontSize: "1rem", padding: "10px" }}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeFromFavorite(product.id)}
                      style={{ borderRadius: "8px", fontSize: "1rem", padding: "10px" }}
                    >
                      Xóa khỏi yêu thích
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

export default FavoritePage;

