import React from 'react';
import PropTypes from 'prop-types';
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaHome } from "react-icons/fa";

function NavBar() {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">FER202 Mobile</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle />
        <BootstrapNavbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/"><FaHome className="me-1" />Home</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/favourites" title="Favourite"><FaHeart /></Nav.Link>
            <Nav.Link as={Link} to="/cart" title="Cart"><FaShoppingCart /></Nav.Link>
            <Nav.Link as={Link} to="/login" title="Login"><FaUser /></Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

NavBar.propTypes = {};

export default NavBar;
