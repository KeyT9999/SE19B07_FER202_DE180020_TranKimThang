import React, { useState } from 'react';
// REACT BOOTSTRAP IMPORTS - Import các component cần thiết cho Account Page
// Container: Responsive container với max-width
// Row, Col: Grid system components
// Card: Container với border và shadow
// ProgressBar: Progress indicator component
// Button: Clickable button component
// Alert: Alert/notification component
import { Container, Row, Col, Card, ProgressBar, Button, Alert } from 'react-bootstrap';
import AboutForm from '../components/Forms/AboutForm';
import AccountForm from '../components/Forms/AccountForm';
import AddressForm from '../components/Forms/AddressForm';
import './AccountPage.css';

export default function AccountPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    about: {},
    account: {},
    address: {}
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    { id: 1, title: 'About', icon: 'bi-person-circle' },
    { id: 2, title: 'Account', icon: 'bi-lock' },
    { id: 3, title: 'Address', icon: 'bi-geo-alt' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleFormChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.about.firstName) newErrors.firstName = true;
        if (!formData.about.lastName) newErrors.lastName = true;
        if (!formData.about.email || !/\S+@\S+\.\S+/.test(formData.about.email)) newErrors.email = true;
        if (!formData.about.phone) newErrors.phone = true;
        if (!formData.about.age || formData.about.age < 1 || formData.about.age > 120) newErrors.age = true;
        break;
      case 2:
        if (!formData.account.username) newErrors.username = true;
        if (!formData.account.password || formData.account.password.length < 6) newErrors.password = true;
        if (formData.account.password !== formData.account.confirmPassword) newErrors.confirmPassword = true;
        if (!formData.account.secretQuestion) newErrors.secretQuestion = true;
        if (!formData.account.secretAnswer) newErrors.secretAnswer = true;
        break;
      case 3:
        if (!formData.address.street) newErrors.street = true;
        if (!formData.address.city) newErrors.city = true;
        if (!formData.address.country) newErrors.country = true;
        if (!formData.address.zipCode) newErrors.zipCode = true;
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      setErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleFinish = () => {
    if (validateStep(currentStep)) {
      setShowSuccess(true);
      console.log('Form submitted:', formData);
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(1);
        setFormData({ about: {}, account: {}, address: {} });
      }, 3000);
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <AboutForm
            formData={formData.about}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <AccountForm
            formData={formData.account}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <AddressForm
            formData={formData.address}
            onFormChange={handleFormChange}
            errors={errors}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="account-wizard">
              <Card.Header className="text-center">
                <h3 className="mb-0">
                  <i className="bi bi-person-plus me-2"></i>
                  Build Your Profile
                </h3>
                <p className="text-muted mb-0">Complete your account setup</p>
              </Card.Header>
              
              <Card.Body>
                {showSuccess && (
                  <Alert variant="success" className="mb-4">
                    <Alert.Heading>Success!</Alert.Heading>
                    Your profile has been created successfully. Welcome to MovieHub!
                  </Alert>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Progress</small>
                    <small className="text-muted">{Math.round(progress)}% Complete</small>
                  </div>
                  <ProgressBar now={progress} variant="success" className="mb-3" />
                  
                  {/* Step Indicators */}
                  <div className="d-flex justify-content-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="text-center">
                        <div className={`step-indicator ${currentStep >= step.id ? 'active' : ''}`}>
                          <i className={step.icon}></i>
                        </div>
                        <small className="step-label">{step.title}</small>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Content */}
                <div className="form-content">
                  {renderCurrentForm()}
                </div>

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      ← Previous
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                      Next →
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
