import React from 'react';
// REACT BOOTSTRAP FORM IMPORTS
// Form: Form wrapper với validation
// Row, Col: Grid system cho responsive layout
// Button: Clickable button component
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function AddressForm({ formData, onFormChange, errors, onPrevious, onFinish }) {
  const handleChange = (field, value) => {
    onFormChange('address', { ...formData, [field]: value });
  };

  return (
    <div>
      <h5 className="mb-4">
        <i className="bi bi-geo-alt me-2"></i>
        Address Information
      </h5>
      
      <Row className="g-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your street address"
              value={formData.street || ''}
              onChange={(e) => handleChange('street', e.target.value)}
              isInvalid={errors.street}
              required
            />
            <Form.Control.Feedback type="invalid">
              Street address is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>City <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your city"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              isInvalid={errors.city}
              required
            />
            <Form.Control.Feedback type="invalid">
              City is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Country <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={formData.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
              isInvalid={errors.country}
              required
            >
              <option value="">Select your country</option>
              <option value="VN">Vietnam</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="TH">Thailand</option>
              <option value="SG">Singapore</option>
              <option value="MY">Malaysia</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select your country
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Zip Code <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your zip code"
              value={formData.zipCode || ''}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              isInvalid={errors.zipCode}
              required
            />
            <Form.Control.Feedback type="invalid">
              Zip code is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={onPrevious}>
          ← Previous
        </Button>
        <Button variant="success" onClick={onFinish}>
          Finish ✓
        </Button>
      </div>
    </div>
  );
}
