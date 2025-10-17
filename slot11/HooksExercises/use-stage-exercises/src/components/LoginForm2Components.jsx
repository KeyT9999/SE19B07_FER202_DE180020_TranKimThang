/*
 * COMPONENT: LoginForm2Components.jsx
 * MỤC ĐÍCH: Minh họa form với object state pattern thay vì multiple states
 * 
 * LUỒNG CHUẨN OBJECT STATE PATTERN:
 * 1. Sử dụng object state cho related data
 * 2. Unified change handler với destructuring
 * 3. Spread operator để update object state
 * 4. Conditional error removal với destructuring
 */

import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';

function LoginForm2() {
  /*
   * OBJECT STATE PATTERN:
   * Sử dụng object thay vì multiple states cho related data
   * Dễ quản lý và scale hơn khi có nhiều fields
   */
  const [user, setUser] = useState({ username: '', password: '' });  // Object state
  const [errors, setErrors] = useState({});                          // Error state
  const [showModal, setShowModal] = useState(false);                 // Modal state

  /*
   * UNIFIED CHANGE HANDLER:
   * Single handler cho tất cả form fields với destructuring
   */
  const handleChange = (e) => {
    const { name, value } = e.target;                    // Destructuring để lấy name và value
    
    // Update object state với spread operator
    setUser((prev) => ({ ...prev, [name]: value }));     // Spread + computed property name

    // VALIDATION LOGIC:
    if (value.trim() === '') {
      // Nếu rỗng: thêm error với dynamic field name
      setErrors((prev) => ({ 
        ...prev, 
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required` 
      }));
    } else {
      // Nếu có giá trị: remove error với destructuring
      setErrors((prev) => {
        const { [name]: removed, ...rest } = prev;       // Destructuring để loại bỏ field
        return rest;
      });
    }
  };

  /*
   * FORM SUBMISSION HANDLER:
   * Validate object state và xử lý kết quả
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate từng field trong object state
    if (user.username.trim() === '') {
      newErrors.username = 'Username is required';
    }
    if (user.password.trim() === '') {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    
    // Nếu không có lỗi: hiển thị modal
    if (Object.keys(newErrors).length === 0) {
      setShowModal(true);
    }
  };

  /*
   * MODAL CLOSE HANDLER:
   * Reset object state về trạng thái ban đầu
   */
  const handleCloseModal = () => {
    setShowModal(false);                                    // Ẩn modal
    setUser({ username: '', password: '' });               // Reset object state
    setErrors({});                                         // Clear errors
  };

  /*
   * RETURN JSX với OBJECT STATE ACCESS:
   * Sử dụng user.username, user.password thay vì separate states
   */
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Login Form 2</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* 
                 * FORM GROUPS với OBJECT STATE:
                 * Sử dụng user.username, user.password từ object state
                 * name prop để identify field trong unified handler
                 */}
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"                    // name prop cho unified handler
                    value={user.username}              // Object state access
                    onChange={handleChange}            // Unified change handler
                    isInvalid={!!errors.username}
                    placeholder="Enter username"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"                    // name prop cho unified handler
                    value={user.password}              // Object state access
                    onChange={handleChange}            // Unified change handler
                    isInvalid={!!errors.password}
                    placeholder="Enter password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* 
       * MODAL với OBJECT STATE DISPLAY:
       * Hiển thị user.username từ object state
       */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-success text-center">
            Welcome, {user.username}!                  {/* Object state access */}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default LoginForm2;