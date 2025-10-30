import React from 'react';
import { Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '70vh' }}
    >
      <LoginForm />
    </Container>
  );
};

export default Login;
