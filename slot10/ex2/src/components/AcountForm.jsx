import React, { useState } from 'react';
// React-Bootstrap imports
import { Form, Button, ProgressBar } from 'react-bootstrap';
import './AcountForm.css';

const AccountForm = ({ formData, onFormDataChange, onNext, onPrevious, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  const secretQuestions = [
    "What is your first pet's name?",
    "What was your childhood nickname?",
    "What is the name of your first school?",
    "What city were you born in?",
    "What is your mother's maiden name?"
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
          - now={67}: phần trăm hoàn thành (67%)
          - Có thể thay đổi: now={50}, now={100}, etc.
          - Có thể thêm variant: variant="success", variant="warning", variant="danger"
          - Có thể thêm animated: animated={true}
          - Có thể thêm striped: striped={true}
          Ví dụ: <ProgressBar now={67} variant="info" animated />
      */}
      <ProgressBar now={67} className="progress-bar-custom" />
      
      <div className="wizard-content">
        <h3><i className="fas fa-lock"></i> Account Information</h3>
        
        {/* React-Bootstrap Form: container chính cho form */}
        <Form>
          {/* React-Bootstrap Form.Group: nhóm các phần tử form */}
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-user"></i> Username *</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username || ''}
              onChange={handleInputChange}
              isInvalid={errors.username}
            />
            <Form.Text className="text-muted">
              Username phải có ít nhất 3 ký tự
            </Form.Text>
            {errors.username && (
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-lock"></i> Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password || ''}
                onChange={handleInputChange}
                isInvalid={errors.password}
              />
              <Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{ border: 'none', background: 'none' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </Button>
            </div>
            <Form.Text className="text-muted">
              Mật khẩu phải có: chữ hoa, chữ thường, số và ký tự đặc biệt
            </Form.Text>
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-lock"></i> Confirm Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword || ''}
                onChange={handleInputChange}
                isInvalid={errors.confirmPassword}
              />
              <Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{ border: 'none', background: 'none' }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </Button>
            </div>
            <Form.Text className="text-muted">
              Nhập lại mật khẩu để xác nhận
            </Form.Text>
            {errors.confirmPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-question"></i> Secret Question *</Form.Label>
            {/* React-Bootstrap Form.Select: dropdown select
                - Tự động styling Bootstrap
                - isInvalid={errors.secretQuestion}: hiển thị validation error
                - Có thể thêm: size="lg" hoặc size="sm"
                - Có thể thêm: multiple (cho phép chọn nhiều)
                - Có thể thêm: disabled={true}
                Ví dụ: <Form.Select size="lg" multiple disabled={false}>
            */}
            <Form.Select
              name="secretQuestion"
              value={formData.secretQuestion || ''}
              onChange={handleInputChange}
              isInvalid={errors.secretQuestion}
            >
              <option value="">Select a secret question</option>
              {secretQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </Form.Select>
            {errors.secretQuestion && (
              <Form.Control.Feedback type="invalid">
                {errors.secretQuestion}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-key"></i> Answer *</Form.Label>
            <Form.Control
              type="text"
              name="secretAnswer"
              placeholder="Enter your answer"
              value={formData.secretAnswer || ''}
              onChange={handleInputChange}
              isInvalid={errors.secretAnswer}
            />
            <Form.Text className="text-muted">
              Câu trả lời phải có ít nhất 2 ký tự
            </Form.Text>
            {errors.secretAnswer && (
              <Form.Control.Feedback type="invalid">
                {errors.secretAnswer}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <div className="wizard-buttons">
            <Button variant="secondary" onClick={onPrevious}>
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

export default AccountForm;