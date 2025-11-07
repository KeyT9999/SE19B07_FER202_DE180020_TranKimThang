
import React, { useContext } from 'react';
import { Navbar, Container, Nav, Dropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import { useApp } from '../contexts/AppContext.jsx';
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";

const AppNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { items: cartItems } = useCart();
  const { items: favoriteItems } = useFavorite();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/products');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/favourites" className="d-flex align-items-center me-3 position-relative">
              <FaHeart className="me-1" />
              {favoriteItems.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    fontSize: "0.7rem",
                  }}
                >
                  {favoriteItems.length}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center me-3 position-relative">
              <FaShoppingCart className="me-1" />
              {cartItems.length > 0 && (
                <Badge
                  bg="primary"
                  pill
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    fontSize: "0.7rem",
                  }}
                >
                  {cartItems.length}
                </Badge>
              )}
            </Nav.Link>

            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="user-dropdown"
                  className="d-flex align-items-center border-0"
                  style={{ background: 'none' }}
                >
                  <FaUser className="me-1" />
                  <span>{user?.email || 'User'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <><Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                <FaUser className="me-1" />
              </Nav.Link><Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <FaSignOutAlt className="me-1" />
                </Nav.Link></>

            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;