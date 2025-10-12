// src/components/home/HomeCarousel.jsx
import React from "react";
import { Carousel, Badge } from "react-bootstrap";
import { carouselMovies } from "../../data/carousel";
import "./HomeCarousel.css";

export default function HomeCarousel() {
  // Nếu mảng rỗng, không render để tránh lỗi
  if (!Array.isArray(carouselMovies) || carouselMovies.length === 0) return null;

  return (
    <Carousel interval={3000} data-bs-theme="dark">
      {carouselMovies.map((m) => (
        <Carousel.Item key={m.id}>
          <img
            className="d-block w-100"
            src={m.poster}
            alt={m.title}
            style={{ height: 420, objectFit: "cover" }}
          />
          <Carousel.Caption
            className="text-start"
            style={{
              background: "rgba(0,0,0,0.35)",
              borderRadius: 12,
              padding: "0.75rem 1rem",
              maxWidth: 720
            }}
          >
            <h3 className="mb-1">
              {m.title}{" "}
              <Badge bg="info" className="text-dark">{m.genre}</Badge>{" "}
              <Badge bg="secondary">{m.year}</Badge>
            </h3>
            <p className="mb-0" style={{ fontSize: "0.95rem" }}>
              {m.description}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
