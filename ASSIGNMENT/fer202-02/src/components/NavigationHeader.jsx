//NavigationHeader.jsx là component thanh điều hướng chung chứa thông tin đăng nhập và nút Logout
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const NavigationHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fullName = user?.fullName || user?.username || 'Student';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="/home" className="d-flex align-items-center fw-semibold">
          <img src="/images/logo.png" alt="PersonalBudget logo" className="navbar-logo" />
          PersonalBudget
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="primary-navbar" />
        <Navbar.Collapse id="primary-navbar">
          <Nav className="ms-auto align-items-center gap-3">
            <Navbar.Text className="text-light">
              Signed in as <strong>{fullName}</strong>
            </Navbar.Text>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavigationHeader;