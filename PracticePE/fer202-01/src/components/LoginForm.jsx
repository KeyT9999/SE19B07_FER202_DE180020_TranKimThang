import React, { useReducer } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { loginFormReducer, initialFormState } from "../reducers/LoginFormReducer";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import PropTypes from "prop-types";

function LoginForm() {
  const navigate = useNavigate();
  const [formState, dispatch] = useReducer(loginFormReducer, initialFormState);
  const { login, loading, error, clearError, user } = useAuth();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = (v) => v.includes("@");

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
    clearError();

    if (name === "identifier") {
      if (!value.trim()) {
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Username or Email is required.",
        });
      } else if (isEmail(value) && !emailRe.test(value)) {
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Email is invalid format.",
        });
      } else {
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Password is required.",
        });
      } else {
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formState.identifier.trim()) {
      errors.identifier = "Username or Email is required.";
    } else if (isEmail(formState.identifier) && !emailRe.test(formState.identifier)) {
      errors.identifier = "Email is invalid format.";
    }
    if (!formState.password.trim()) {
      errors.password = "Password is required.";
    }
    dispatch({ type: "SET_ERRORS", errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) {
      return;
    }

    const result = await login(formState.identifier, formState.password);

    if (result.ok) {
      dispatch({ type: "SHOW_SUCCESS_MODAL" });
      setTimeout(() => {
        dispatch({ type: "HIDE_SUCCESS_MODAL" });
        navigate("/mobiles");
      }, 2000);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card style={{ border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
            <Card.Body style={{ padding: "2rem" }}>
              <h2 className="text-center mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Welcome Back!
              </h2>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group controlId="identifier" className="mb-3">
                  <Form.Label>Username or Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="identifier"
                    value={formState.identifier}
                    onChange={handleChange}
                    isInvalid={!!formState.errors.identifier}
                    placeholder="Enter your username or email"
                    disabled={loading}
                    style={{ borderRadius: "8px", padding: "12px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                      isInvalid={!!formState.errors.password}
                      placeholder="Enter your password"
                      disabled={loading}
                      style={{ borderRadius: "8px", padding: "12px" }}
                    />
                    <InputGroup.Text style={{ cursor: "pointer" }} onClick={() => {
                      const input = document.getElementById("password");
                      if (input.type === "password") {
                        input.type = "text";
                      } else {
                        input.type = "password";
                      }
                    }}>
                      👁️
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                  style={{ borderRadius: "8px", padding: "12px", fontSize: "1.1rem" }}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center">
                  <small>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0d6efd",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      Sign Up
                    </button>
                  </small>
                </div>

                {error && (
                  <Alert variant="danger" className="mt-3" onClose={clearError} dismissible>
                    {error}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ConfirmModal
        show={formState.showSuccessModal}
        title="Login Successful"
        message={`Welcome, ${user?.username}! Login successful.`}
      />
    </Container>
  );
}

LoginForm.propTypes = {};

export default LoginForm;

