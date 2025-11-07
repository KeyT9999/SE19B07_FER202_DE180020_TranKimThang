import React from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">
        <Alert.Heading>404 - Page Not Found</Alert.Heading>
        <p>The page you are looking for does not exist.</p>
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate("/")} className="me-2">
            Go to Home
          </Button>
          <Button variant="secondary" onClick={() => navigate("/mobiles")}>
            Back to Mobile List
          </Button>
        </div>
      </Alert>
    </Container>
  );
}

NotFoundPage.propTypes = {};

export default NotFoundPage;

