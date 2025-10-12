import React from 'react';
// REACT BOOTSTRAP FORM IMPORTS
// Form: Form wrapper với validation
// Row, Col: Grid system cho responsive layout
// InputGroup: Group input với addons
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

export default function AccountForm({ formData, onFormChange, errors }) {
  const handleChange = (field, value) => {
    onFormChange('account', { ...formData, [field]: value });
  };

  return (
    <div>
      <h5 className="mb-4">
        <i className="bi bi-lock me-2"></i>
        Account Information
      </h5>
      
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Username <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={formData.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                isInvalid={errors.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                Username is required
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Password <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                isInvalid={errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                Password is required (min 6 characters)
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword || ''}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                isInvalid={errors.confirmPassword}
                required
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Secret Question <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={formData.secretQuestion || ''}
              onChange={(e) => handleChange('secretQuestion', e.target.value)}
              isInvalid={errors.secretQuestion}
              required
            >
              <option value="">Select a security question</option>
              <option value="pet">What was the name of your first pet?</option>
              <option value="school">What was the name of your elementary school?</option>
              <option value="city">What city were you born in?</option>
              <option value="mother">What is your mother's maiden name?</option>
              <option value="street">What street did you grow up on?</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a security question
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label>Answer <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your answer to the security question"
              value={formData.secretAnswer || ''}
              onChange={(e) => handleChange('secretAnswer', e.target.value)}
              isInvalid={errors.secretAnswer}
              required
            />
            <Form.Control.Feedback type="invalid">
              Answer is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}
