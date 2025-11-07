import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

function NavBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Mobile Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Home
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link 
              onClick={() => navigate("/favourite")}
              style={{ cursor: "pointer" }}
            >
              ❤️ Favourite
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            >
              🛒 Cart
            </Nav.Link>
            {isAuthenticated && user ? (
              <NavDropdown 
                title={`👤 ${user.username}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link 
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer" }}
                >
                  🔐 Login
                </Nav.Link>
                <Nav.Link 
                  onClick={() => navigate("/register")}
                  style={{ cursor: "pointer" }}
                >
                  📝 Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

NavBar.propTypes = {};

export default NavBar;

