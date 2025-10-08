import React from "react";
import HomeCarousel from "../components/home/HomeCarousel";
import { movies } from "../data/movies";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../components/Movie/MovieCard";

export default function HomePage() {
  return (
    <div>
      <HomeCarousel />

      <Container className="mt-4">
        <h4 className="mb-3">Featured Movies Collections</h4>
        <Row className="g-3">
          {movies.map((m) => (
            <Col key={m.id} xs={12} md={6} lg={4}>
              <MovieCard movie={m} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
