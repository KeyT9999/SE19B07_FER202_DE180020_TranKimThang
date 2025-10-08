import { useEffect, useState } from "react";
import {
  Card, Button, Badge, Row, Col, Modal, Toast, ToastContainer,
} from "react-bootstrap";
import "./MovieCard.css";

// Rút gọn mô tả
const truncate = (str = "", max = 110) => (str.length > max ? str.slice(0, max) + "..." : str);

// localStorage helpers
const LS_KEY = "favourites";
const getFavs = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
};
const saveFavs = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

export default function MovieCard({ movie }) {
  const { id, poster, title, description, genre, year, country, duration, showtimes = [] } = movie;

  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavs().some((m) => m.id === id));
  }, [id]);

  const handleAddFav = () => {
    const favs = getFavs();
    if (!favs.some((m) => m.id === id)) {
      favs.push({ id, title, poster, year, genre });
      saveFavs(favs);
      setIsFav(true);
    }
    setShowToast(true);
  };

  return (
    <>
      <Card className="movie-card h-100 border-0 shadow-sm">
        <div className="ratio ratio-16x9">
          <img
            src={poster}
            alt={`Poster of ${title}`}
            className="card-img-top"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>

        <Card.Body>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Card.Title className="mb-0">{title}</Card.Title>
            <Badge bg="secondary">{year}</Badge>
            <Badge bg="info" text="dark">{genre}</Badge>
          </div>

          <Card.Text className="text-secondary mb-3">{truncate(description)}</Card.Text>

          <Row className="small text-muted mb-3 g-2">
            <Col xs="auto"><strong>Country:</strong> {country}</Col>
            <Col xs="auto"><strong>Duration:</strong> {duration}’</Col>
          </Row>

          <div className="d-flex gap-2">
            <Button variant={isFav ? "outline-success" : "success"} onClick={handleAddFav}>
              {isFav ? "Favourited ✓" : "Add to Favourites"}
            </Button>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              View Details
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <Badge bg="info" text="dark" className="me-2">{genre}</Badge>
            <Badge bg="secondary" className="me-2">{year}</Badge>
            <Badge bg="dark">{country}</Badge>
          </div>
          <p className="mb-2">{description}</p>
          <div className="mb-1"><strong>Showtimes:</strong> {showtimes.length ? showtimes.join(" • ") : "Updating..."}</div>
          <div><strong>Duration:</strong> {duration} minutes</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary">Book Now</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast thông báo */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={1500} autohide bg="dark">
          <Toast.Header closeButton>
            <strong className="me-auto">Movies</strong>
            <small className="text-muted">just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">Added to favourites!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
