/*
 * COMPONENT: AccountSearchComponents.jsx
 * MỤC ĐÍCH: Minh họa advanced search với multiple states, form submission, và React Bootstrap layout
 * 
 * LUỒNG CHUẨN ADVANCED SEARCH:
 * 1. Multiple states (search, result, submitted)
 * 2. Form submission với validation
 * 3. Data normalization cho search
 * 4. Conditional rendering dựa trên search state
 * 5. Responsive grid layout với Cards
 */

import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

/*
 * ACCOUNTS DATA:
 * Array chứa account data với avatar images
 */
const accounts = [
  { id: 1, username: "thang",   displayName: "Thắng", password: "thang123",   avatar: "/Image/DE180020.jpg" },
  { id: 2, username: "danh",    displayName: "Danh",  password: "danh456",    avatar: "/Image/DE180814.jpg" },
  { id: 3, username: "phuc",    displayName: "Phúc",  password: "phuc789",    avatar: "/Image/DE190234.jpg" },
  { id: 4, username: "tai",     displayName: "Tài",   password: "tai000",     avatar: "/Image/DE190491.jpg" },
];

/*
 * TEXT NORMALIZATION FUNCTION:
 * Chuẩn hóa text để search không phân biệt hoa thường và dấu
 * - trim(): loại bỏ khoảng trắng đầu/cuối
 * - toLowerCase(): chuyển về chữ thường
 * - normalize("NFD"): tách dấu khỏi ký tự
 * - replace(): loại bỏ dấu để search dễ hơn
 */
const normalizeText = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function AccountSearch() {
  /*
   * MULTIPLE STATES cho ADVANCED SEARCH:
   * - searchTerm: text trong ô search
   * - result: account tìm được (null nếu không tìm thấy)
   * - submitted: trạng thái đã submit hay chưa
   */
  const [searchTerm, setSearchTerm] = useState("");     // Search input value
  const [result, setResult] = useState(null);           // Found account hoặc null
  const [submitted, setSubmitted] = useState(false);    // Submit state để control UI

  /*
   * FORM SUBMISSION HANDLER:
   * Xử lý search với exact match và update states
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const term = normalizeText(searchTerm);
    
    // Nếu search term rỗng: reset states
    if (!term) {
      setResult(null);
      setSubmitted(false);
      return;
    }
    
    /*
     * SEARCH LOGIC:
     * Tìm account với exact match username hoặc displayName
     * Sử dụng normalizeText để so sánh không phân biệt dấu
     */
    const found = accounts.find(acc => {
      const usernameMatch = normalizeText(acc.username) === term;
      const displayMatch = normalizeText(acc.displayName) === term;
      return usernameMatch || displayMatch;
    });
    
    setResult(found || null);    // Set result hoặc null
    setSubmitted(true);          // Mark as submitted
  };

  /*
   * CLEAR HANDLER:
   * Reset tất cả states về trạng thái ban đầu
   */
  const handleClear = () => {
    setSearchTerm("");
    setResult(null);
    setSubmitted(false);
  };

  /*
   * CONDITIONAL LOGIC cho DISPLAY:
   * - showAll: true nếu chưa submit hoặc search term rỗng
   * - listToRender: hiển thị all accounts hoặc single result
   */
  const showAll = !submitted || searchTerm.trim() === "";
  const listToRender = showAll ? accounts : (result ? [result] : []);

  /*
   * RETURN JSX với REACT BOOTSTRAP LAYOUT:
   * Container, Form, Alert, responsive Grid với Cards
   */
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Tìm kiếm Account theo Username</h2>

      {/* 
       * SEARCH FORM với RESPONSIVE LAYOUT:
       * Row/Col để tạo responsive form layout
       */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-2">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Nhập chính xác username (vd: thang)"
              value={searchTerm}                              // Controlled component
              onChange={(e) => setSearchTerm(e.target.value)} // Update search state
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

      {/* 
       * CONDITIONAL ALERT:
       * Hiển thị warning khi không tìm thấy kết quả
       */}
      {!showAll && !result && (
        <Alert variant="warning" className="text-center">Không tìm thấy kết quả</Alert>
      )}

      {/* 
       * RESPONSIVE GRID LAYOUT:
       * xs=1, sm=2, md=2, lg=4 columns tùy theo screen size
       * g-4: gap giữa các items
       */}
      <Row xs={1} sm={2} md={2} lg={4} className="g-4">
        {listToRender.map(acc => (
          <Col key={acc.id} lg={3}>
            {/* 
             * REACT BOOTSTRAP CARD:
             * h-100: full height, shadow-sm: subtle shadow
             * border-0: no border
             */}
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={acc.avatar}
                alt={acc.displayName ?? acc.username}
                style={{ height: 260, objectFit: "cover" }}  // Fixed height với cover
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
