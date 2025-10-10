import React from 'react';
// React-Bootstrap imports
import { Form, Button, ProgressBar } from 'react-bootstrap';
import './AddressForm.css';

const AddressForm = ({ formData, onFormDataChange, onFinish, onPrevious, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  const countries = [
    'Vietnam',
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'South Korea',
    'China',
    'India',
    'Australia',
    'Brazil',
    'Mexico',
    'Italy',
    'Spain'
  ];

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2><i className="fas fa-user"></i> Build Your Profile</h2>
        <button type="button" className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* React-Bootstrap ProgressBar: hiển thị tiến độ hoàn thành wizard
          - now={100}: phần trăm hoàn thành (100% - cuối cùng)
          - Có thể thay đổi: now={50}, now={75}, etc.
          - Có thể thêm variant: variant="success" (màu xanh khi hoàn thành)
          - Có thể thêm animated: animated={true}
          - Có thể thêm striped: striped={true}
          Ví dụ: <ProgressBar now={100} variant="success" animated striped />
      */}
      <ProgressBar now={100} className="progress-bar-custom" />
      
      <div className="wizard-content">
        <h3><i className="fas fa-map-marker-alt"></i> Address Information</h3>
        
        {/* React-Bootstrap Form: container chính cho form */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-road"></i> Street *</Form.Label>
            <Form.Control
              type="text"
              name="street"
              placeholder="123 Main Street"
              value={formData.street || ''}
              onChange={handleInputChange}
              isInvalid={errors.street}
            />
            <Form.Text className="text-muted">
              Nhập địa chỉ đường phố nơi bạn sinh sống
            </Form.Text>
            {errors.street && (
              <Form.Control.Feedback type="invalid">
                {errors.street}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-city"></i> City *</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="Ho Chi Minh City"
              value={formData.city || ''}
              onChange={handleInputChange}
              isInvalid={errors.city}
            />
            <Form.Text className="text-muted">
              Nhập tên thành phố nơi bạn sinh sống
            </Form.Text>
            {errors.city && (
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-map"></i> State *</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="Ho Chi Minh"
              value={formData.state || ''}
              onChange={handleInputChange}
              isInvalid={errors.state}
            />
            <Form.Text className="text-muted">
              Nhập tên tỉnh/thành phố nơi bạn sinh sống
            </Form.Text>
            {errors.state && (
              <Form.Control.Feedback type="invalid">
                {errors.state}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-mail-bulk"></i> Zip Code *</Form.Label>
            <Form.Control
              type="text"
              name="zipCode"
              placeholder="700000"
              value={formData.zipCode || ''}
              onChange={handleInputChange}
              isInvalid={errors.zipCode}
            />
            <Form.Text className="text-muted">
              Nhập mã bưu điện (postal code)
            </Form.Text>
            {errors.zipCode && (
              <Form.Control.Feedback type="invalid">
                {errors.zipCode}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-flag"></i> Country *</Form.Label>
            {/* React-Bootstrap Form.Select: dropdown select cho country
                - Tự động styling Bootstrap
                - isInvalid={errors.country}: hiển thị validation error
                - Có thể thêm: size="lg" hoặc size="sm"
                - Có thể thêm: multiple (cho phép chọn nhiều quốc gia)
                - Có thể thêm: disabled={true}
                Ví dụ: <Form.Select size="lg" multiple={false} disabled={false}>
            */}
            <Form.Select
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              isInvalid={errors.country}
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Chọn quốc gia nơi bạn sinh sống
            </Form.Text>
            {errors.country && (
              <Form.Control.Feedback type="invalid">
                {errors.country}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <div className="wizard-buttons">
            {/* React-Bootstrap Button: nút bấm với nhiều tùy chọn
                - variant="secondary": màu xám cho Previous
                - variant="success": màu xanh cho Finish (thành công)
                - Có thể thay đổi variant: primary, danger, warning, info, light, dark
                - Có thể thêm: size="lg" hoặc size="sm"
                - Có thể thêm: block (full width)
                - Có thể thêm: disabled={true}
                Ví dụ: <Button variant="danger" size="lg" block disabled={false}>Cancel</Button>
            */}
            <Button variant="secondary" onClick={onPrevious}>
              Previous
            </Button>
            <Button variant="success" onClick={onFinish}>
              Finish
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddressForm;
