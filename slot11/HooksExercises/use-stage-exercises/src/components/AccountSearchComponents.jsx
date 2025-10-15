// src/components/AccountSearch.jsx
import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const accounts = [
  { id: 1, username: "thang",   displayName: "Thắng", password: "thang123",   avatar: "/Image/DE180020.jpg" },
  { id: 2, username: "danh",    displayName: "Danh",  password: "danh456",    avatar: "/Image/DE180814.jpg" },
  { id: 3, username: "phuc",    displayName: "Phúc",  password: "phuc789",    avatar: "/Image/DE190234.jpg" },
  { id: 4, username: "tai",     displayName: "Tài",   password: "tai000",     avatar: "/Image/DE190491.jpg" },
];

const normalizeText = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function AccountSearch() {
  // state (trạng thái) cho ô tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // state kết quả “1 account” (khi submit)
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = normalizeText(searchTerm);
    if (!term) {
      setResult(null);
      setSubmitted(false);
      return;
    }
    const found = accounts.find(acc => {
      const usernameMatch = normalizeText(acc.username) === term;
      const displayMatch = normalizeText(acc.displayName) === term;
      return usernameMatch || displayMatch;
    });
    setResult(found || null);
    setSubmitted(true);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResult(null);
    setSubmitted(false);
  };

  // Hiển thị: nếu chưa submit hoặc searchTerm rỗng → toàn bộ accounts
  const showAll = !submitted || searchTerm.trim() === "";
  const listToRender = showAll ? accounts : (result ? [result] : []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Tìm kiếm Account theo Username</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-2">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Nhập chính xác username (vd: thang)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <Button type="submit" variant="primary">Tìm 1 account</Button>
          </Col>
          <Col md="auto">
            <Button variant="outline-secondary" onClick={handleClear}>Clear</Button>
          </Col>
        </Row>
        <Form.Text muted>
          Gợi ý: khi ô trống hoặc chưa tìm, hệ thống sẽ hiển thị **tất cả** account.
        </Form.Text>
      </Form>

      {/* Không tìm thấy */}
      {!showAll && !result && (
        <Alert variant="warning" className="text-center">Không tìm thấy kết quả</Alert>
      )}

      <Row xs={1} sm={2} md={2} lg={4} className="g-4">
        {listToRender.map(acc => (
          <Col key={acc.id} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={acc.avatar}
                alt={acc.displayName ?? acc.username}
                style={{ height: 260, objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-capitalize">@{acc.displayName ?? acc.username}</Card.Title>
                <Card.Text className="mb-0">
                  <strong>ID:</strong> {acc.id}
                </Card.Text>
                <Card.Text className="text-muted" style={{ userSelect: "none" }}>
                  <em>password:</em> {acc.password}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
