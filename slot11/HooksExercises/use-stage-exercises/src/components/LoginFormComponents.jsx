//LoginForm component is used to render a login form with username and password fields, including validation and error handling.
import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';  

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  //useState hiển thị modal
  const [showModal, setShowModal] = useState(false);

//Xử lý thay đổi input
const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value.trim() === '') {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
    } else {
      setErrors((prev) => {
        const { username, ...rest } = prev;
        return rest;
      });
    }
  }
  //Xử lý thay đổi password
    const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim() === '') {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
    } else {
      setErrors((prev) => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  }
    //Xử lý submit form
    const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    const newErrors = {};       
    if (username.trim() === '') {
      newErrors.username = 'Username is required';
    }
    if (password.trim() === '') {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      //onSubmit({ username, password });
        setShowModal(true); // Hiển thị modal khi không có lỗi

    }
    }
    //Đóng modal
    const handleCloseModal = () => {
    setShowModal(false);
    setUsername('');
    setPassword('');
    setErrors({});
  }

    return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Login</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>  
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text"
                                value={username}
                                onChange={handleUsernameChange} 
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
                                value={password}
                                onChange={handlePasswordChange} 
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
         {/* Modal hiển thị khi đăng nhập thành công */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome, {username}!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
    );
}

export default LoginForm;