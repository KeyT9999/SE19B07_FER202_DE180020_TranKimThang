import React, { useState } from 'react';
// REACT BOOTSTRAP FORM IMPORTS
// Form: Form wrapper với validation
// Row, Col: Grid system cho responsive layout
// InputGroup: Group input với addons
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

export default function AboutForm({ formData, onFormChange, errors }) {
  const handleChange = (field, value) => {
    onFormChange('about', { ...formData, [field]: value });
  };

  return (
    <div>
      <h5 className="mb-4">
        <i className="bi bi-person-circle me-2"></i>
        About Information
      </h5>
      
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              isInvalid={errors.firstName}
              required
            />
            <Form.Control.Feedback type="invalid">
              First name is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              isInvalid={errors.lastName}
              required
            />
            <Form.Control.Feedback type="invalid">
              Last name is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              isInvalid={errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              isInvalid={errors.phone}
              required
            />
            <Form.Control.Feedback type="invalid">
              Phone number is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Age <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="120"
              placeholder="Enter your age"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              isInvalid={errors.age}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid age
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleChange('avatar', e.target.files[0])}
            />
            <Form.Text className="text-muted">
              Upload your profile picture (optional)
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}
