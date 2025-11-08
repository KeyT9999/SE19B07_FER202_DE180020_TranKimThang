import React from "react";
import { Container, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container fluid className="p-0">
      {/* Carousel */}
      <Carousel fade className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/carousel/carousel1.jpg"
            alt="iPhone 16"
            style={{ height: "500px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1200x500?text=iPhone+16";
            }}
          />
          <Carousel.Caption style={{ textAlign: "left", bottom: "20%", left: "5%" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>iPhone 16</h1>
            <p style={{ fontSize: "1.2rem" }}>Hiệu năng thế hệ mới, nâng cấp camera & pin.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/carousel/carousel2.jpg"
            alt="Latest Models"
            style={{ height: "500px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1200x500?text=Latest+Models";
            }}
          />
          <Carousel.Caption style={{ textAlign: "left", bottom: "20%", left: "5%" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>Latest Models</h1>
            <p style={{ fontSize: "1.2rem" }}>Khám phá những camera mới nhất.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/carousel/carousel3.jpg"
            alt="Great Deals"
            style={{ height: "500px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1200x500?text=Great+Deals";
            }}
          />
          <Carousel.Caption style={{ textAlign: "left", bottom: "20%", left: "5%" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>Great Deals</h1>
            <p style={{ fontSize: "1.2rem" }}>Ưu đãi đặc biệt cho camera cao cấp.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Welcome Section */}
      <Container className="text-center mb-5 py-5">
        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
          Welcome to Our Shop
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
          The best place to buy camera shop online with great offers and quality products.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          style={{ padding: "12px 30px", fontSize: "1.1rem", borderRadius: "8px" }}
          onClick={() => navigate("/cameras")}
        >
          Browse camera shop →
        </Button>
      </Container>
    </Container>
  );
}

export default HomePage;

