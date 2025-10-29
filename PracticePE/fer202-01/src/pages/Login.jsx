import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username or Email is required.';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Fetch all users
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // Find matching user
      const user = users.find(
        u =>
          (u.username === formData.username || u.email === formData.username) &&
          u.password === formData.password
      );

      if (user) {
        setLoginUser(user);
        login(user);
        setShowModal(true);
        setAlertMessage('');
      } else {
        setAlertMessage('Invalid username or password!');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAlertMessage('An error occurred. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/mobiles');
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Welcome Back!</h2>
        
        {alertMessage && (
          <Alert variant="danger" className="mb-3">
            {alertMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account?{' '}
          <a href="/register" style={{ textDecoration: 'underline' }}>
            Sign Up
          </a>
        </p>
      </div>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Welcome, <strong>{loginUser?.username}</strong>! Login successful.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

Login.propTypes = {};

export default Login;
