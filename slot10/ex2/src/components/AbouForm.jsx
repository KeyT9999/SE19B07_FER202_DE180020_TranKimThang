import React, { useState } from 'react';
// React-Bootstrap imports
import { Form, Button, ProgressBar } from 'react-bootstrap';
import './AboutForm.css';

const AboutForm = ({ formData, onFormDataChange, onNext, errors }) => {
  const [avatarFile, setAvatarFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    onFormDataChange('avatar', file);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2><i className="fas fa-user"></i> Build Your Profile</h2>
        <button type="button" className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* React-Bootstrap ProgressBar: hiển thị tiến độ hoàn thành wizard
          - now={33}: phần trăm hoàn thành (33%)
          - Có thể thay đổi: now={50}, now={100}, etc.
          - Có thể thêm variant: variant="success", variant="warning", variant="danger"
          - Có thể thêm animated: animated={true}
          - Có thể thêm striped: striped={true}
          Ví dụ: <ProgressBar now={33} variant="success" animated striped />
      */}
      <ProgressBar now={33} className="progress-bar-custom" />
      
      <div className="wizard-content">
        <h3><i className="fas fa-user"></i> About Information</h3>
        
        {/* React-Bootstrap Form: container chính cho form
            - Tự động xử lý validation và styling
            - Có thể thêm: noValidate (tắt HTML5 validation)
            - Có thể thêm: onSubmit={handleSubmit}
            Ví dụ: <Form noValidate onSubmit={handleSubmit}>
        */}
        <Form>
          <Form.Group className="mb-3">
            {/* React-Bootstrap Form.Label: label cho input
                - Tự động styling và accessibility
                - Có thể thêm: htmlFor="firstName" (liên kết với input)
                - Có thể thêm: column (cho horizontal layout)
                - Có thể thêm: sm={2} (cho responsive)
                Ví dụ: <Form.Label htmlFor="firstName" column sm={2}>
            */}
            <Form.Label><i className="fas fa-user"></i> First Name *</Form.Label>
            {/* React-Bootstrap Form.Control: input field chính
                - type="text": loại input (có thể: email, password, tel, number, file, etc.)
                - isInvalid={errors.firstName}: hiển thị validation error (màu đỏ)
                - Có thể thêm: size="lg" hoặc size="sm" (large/small input)
                - Có thể thêm: placeholder="Enter first name"
                - Có thể thêm: disabled={true}
                - Có thể thêm: readOnly={true}
                - Có thể thêm: required={true} (HTML5 validation)
                Ví dụ: <Form.Control type="text" size="lg" placeholder="Enter first name" isInvalid={errors.firstName} />
            */}
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleInputChange}
              isInvalid={errors.firstName}
            />
            {/* React-Bootstrap Form.Control.Feedback: hiển thị thông báo validation
                - type="invalid": màu đỏ cho error (có thể: "valid" cho màu xanh)
                - Tự động hiển thị khi isInvalid={true} trên Form.Control
                - Có thể thêm: tooltip={true} (hiển thị tooltip thay vì text)
                Ví dụ: <Form.Control.Feedback type="valid" tooltip>Looks good!</Form.Control.Feedback>
            */}
            {errors.firstName && (
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-user"></i> Last Name *</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleInputChange}
              isInvalid={errors.lastName}
            />
            {errors.lastName && (
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-envelope"></i> Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email || ''}
              onChange={handleInputChange}
              isInvalid={errors.email}
            />
            {/* React-Bootstrap Form.Text: text gợi ý cho user
                - className="text-muted": màu xám nhạt
                - Có thể thay đổi: text-primary, text-success, text-warning, text-danger
                - Có thể thêm: as="small" (hiển thị text nhỏ hơn)
                Ví dụ: <Form.Text className="text-primary" as="small">This is a hint</Form.Text>
            */}
            <Form.Text className="text-muted">
              Email phải có định dạng @gmail.com
            </Form.Text>
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-phone"></i> Phone *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="0123456789"
              value={formData.phone || ''}
              onChange={handleInputChange}
              isInvalid={errors.phone}
            />
            <Form.Text className="text-muted">
              Số điện thoại phải có đúng 10 chữ số
            </Form.Text>
            {errors.phone && (
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-user"></i> Age *</Form.Label>
            <Form.Control
              type="number"
              name="age"
              placeholder="18"
              min="1"
              max="120"
              value={formData.age || ''}
              onChange={handleInputChange}
              isInvalid={errors.age}
            />
            <Form.Text className="text-muted">
              Tuổi phải là số từ 1 đến 120
            </Form.Text>
            {errors.age && (
              <Form.Control.Feedback type="invalid">
                {errors.age}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-user"></i> Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Form.Text className="text-muted">
              {avatarFile ? avatarFile.name : 'No file chosen'}
            </Form.Text>
          </Form.Group>

          <div className="wizard-buttons">
            {/* React-Bootstrap Button: nút bấm với nhiều tùy chọn
                - variant="secondary": màu xám (có thể: primary, success, danger, warning, info, light, dark)
                - disabled: vô hiệu hóa nút (không thể click)
                - onClick={onNext}: xử lý sự kiện click
                - Có thể thêm: size="lg" hoặc size="sm" (large/small button)
                - Có thể thêm: type="submit" (submit form)
                - Có thể thêm: block (full width)
                Ví dụ: <Button variant="success" size="lg" block onClick={handleSubmit}>Submit</Button>
            */}
            <Button variant="secondary" disabled>
              Previous
            </Button>
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AboutForm;
