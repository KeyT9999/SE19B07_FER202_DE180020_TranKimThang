import React, { useState } from 'react';
// React-Bootstrap imports
import { Tabs, Tab, Alert } from 'react-bootstrap';
import AboutForm from '../components/AbouForm';
import AccountForm from '../components/AcountForm';
import AddressForm from '../components/AddressForm';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    // About form data
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    avatar: null,
    
    // Account form data
    username: '',
    password: '',
    confirmPassword: '',
    secretQuestion: '',
    secretAnswer: '',
    
    // Address form data
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormDataChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateAboutForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (!/^\d+$/.test(formData.age.toString())) {
      newErrors.age = 'Age must be a number';
    } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAccountForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const password = formData.password;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!hasUpperCase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!hasLowerCase) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!hasNumbers) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!hasSpecialChar) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Secret Question validation
    if (!formData.secretQuestion) {
      newErrors.secretQuestion = 'Secret question is required';
    }
    
    // Secret Answer validation
    if (!formData.secretAnswer.trim()) {
      newErrors.secretAnswer = 'Answer is required';
    } else if (formData.secretAnswer.length < 2) {
      newErrors.secretAnswer = 'Answer must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressForm = () => {
    const newErrors = {};
    
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeTab === 'about' && validateAboutForm()) {
      setActiveTab('account');
    } else if (activeTab === 'account' && validateAccountForm()) {
      setActiveTab('address');
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'account') {
      setActiveTab('about');
    } else if (activeTab === 'address') {
      setActiveTab('account');
    }
  };

  const handleFinish = () => {
    if (validateAddressForm()) {
      setShowSuccess(true);
      console.log('Form submitted:', formData);
    }
  };

  const handleTabSelect = (key) => {
    // Only allow tab switching if current form is valid
    if (key === 'account' && !validateAboutForm()) return;
    if (key === 'address' && (!validateAboutForm() || !validateAccountForm())) return;
    
    setActiveTab(key);
  };

  if (showSuccess) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* React-Bootstrap Alert: hiển thị thông báo thành công
                - variant="success": màu xanh cho thông báo thành công
                - Có thể thay đổi variant: primary, secondary, danger, warning, info, light, dark
                - className="text-center": căn giữa text
                - Có thể thêm: dismissible (có nút đóng)
                - Có thể thêm: onClose={handleClose} (xử lý đóng alert)
                - Có thể thêm: show={showAlert} (điều khiển hiển thị)
                Ví dụ: <Alert variant="danger" dismissible onClose={handleClose} show={true}>
            */}
            <Alert variant="success" className="text-center">
              <h4>Profile Created Successfully!</h4>
              <p>Your profile has been saved successfully.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowSuccess(false);
                  setActiveTab('about');
                   setFormData({
                     firstName: '',
                     lastName: '',
                     email: '',
                     phone: '',
                     age: '',
                     avatar: null,
                     username: '',
                     password: '',
                     confirmPassword: '',
                     secretQuestion: '',
                     secretAnswer: '',
                     street: '',
                     city: '',
                     state: '',
                     zipCode: '',
                     country: ''
                   });
                  setErrors({});
                }}
              >
                Create Another Profile
              </button>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* React-Bootstrap Tabs: container chính cho tab navigation
              - activeKey={activeTab}: tab hiện tại đang active
              - onSelect={handleTabSelect}: xử lý khi chọn tab
              - className="wizard-tabs": custom CSS class
              - id="profile-wizard": unique ID
              - Có thể thêm: variant="tabs" hoặc variant="pills" (style khác nhau)
              - Có thể thêm: justify (căn đều tabs)
              - Có thể thêm: fill (fill full width)
              - Có thể thêm: vertical (tabs dọc)
              Ví dụ: <Tabs variant="pills" justify fill vertical>
          */}
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="wizard-tabs"
            id="profile-wizard"
          >
            {/* React-Bootstrap Tab: tab riêng lẻ
                - eventKey="about": key để xác định tab (phải match với activeKey)
                - title="About": text hiển thị trên tab header
                - Có thể thêm: disabled={true} (vô hiệu hóa tab)
                - Có thể thêm: tabClassName="custom-tab-class" (custom CSS cho tab header)
                - Có thể thêm: mountOnEnter={true} (chỉ mount khi tab được chọn)
                - Có thể thêm: unmountOnExit={true} (unmount khi tab không được chọn)
                Ví dụ: <Tab eventKey="about" title="About" disabled={false} mountOnEnter>
            */}
            <Tab eventKey="about" title="About">
              <AboutForm
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onNext={handleNext}
                errors={errors}
              />
            </Tab>
            {/* React-Bootstrap Tab: tab riêng lẻ cho Account form */}
            <Tab eventKey="account" title="Account">
              <AccountForm
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                errors={errors}
              />
            </Tab>
            {/* React-Bootstrap Tab: tab riêng lẻ cho Address form */}
            <Tab eventKey="address" title="Address">
              <AddressForm
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onFinish={handleFinish}
                onPrevious={handlePrevious}
                errors={errors}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;