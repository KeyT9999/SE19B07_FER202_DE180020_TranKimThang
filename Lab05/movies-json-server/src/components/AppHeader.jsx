import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthState } from '../contexts/AuthContext';

const AppHeader = () => {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const displayName = user?.fullName || user?.username;

  // Clear session then redirect to login so protected routes lock again.
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={user ? '/movies' : '/login'}>
          🎬 Movie Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav" className="justify-content-between">
          {user && (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/movies">
                Danh sách phim
              </Nav.Link>
            </Nav>
          )}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="text-light text-end">
                  <div className="fw-semibold">Welcome, {displayName}</div>
                  <small className="text-secondary">{user.email}</small>
                </div>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login" className="text-light">
                Đăng nhập
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppHeader;
