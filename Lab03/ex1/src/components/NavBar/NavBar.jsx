import React, { useState } from 'react';
// REACT BOOTSTRAP IMPORTS - Import các component từ react-bootstrap
// Lý do: React Bootstrap cung cấp các component được tối ưu cho React, 
// thay vì sử dụng Bootstrap thuần với data attributes
import { Navbar, Nav, Form, InputGroup, Dropdown, Button } from 'react-bootstrap';
import './NavBar.css';

export default function NavBar({ currentPage, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to movies page với search term
      if (onNavigate) {
        onNavigate('movies', searchTerm.trim());
      }
      console.log('Searching for:', searchTerm);
      // Clear search after submitting
      setSearchTerm('');
    }
  };

  const handleNavigation = (page, searchQuery = null) => {
    if (onNavigate) {
      onNavigate(page, searchQuery);
    }
  };

  return (
    <>
      {/* REACT BOOTSTRAP NAVBAR COMPONENT
          bg="dark": Màu nền tối (có thể thay bằng bg="primary", bg="secondary", bg="light")
          variant="dark": Màu text sáng cho contrast tốt (có thể thay bằng variant="light")
          expand="lg": Responsive breakpoint (có thể thay bằng expand="sm", expand="md", expand="xl")
          Lý do dùng Navbar: Cung cấp responsive navigation với collapse functionality */}
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <div className="container-fluid">
        {/* REACT BOOTSTRAP NAVBAR BRAND
            Navbar.Brand: Logo/brand name của website
            Lý do dùng: Tự động styling và responsive behavior
            Có thể thay bằng: <div className="navbar-brand"> hoặc custom component */}
        <Navbar.Brand 
          href="#" 
          className="fw-bold"
          onClick={() => handleNavigation('home')}
        >
          <i className="bi bi-film me-2"></i>MovieHub
        </Navbar.Brand>

        {/* REACT BOOTSTRAP NAVBAR TOGGLE
            Navbar.Toggle: Hamburger menu button cho mobile
            aria-controls: Accessibility cho screen readers
            Lý do dùng: Tự động handle collapse/expand trên mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* REACT BOOTSTRAP NAVBAR COLLAPSE
            Navbar.Collapse: Container cho navigation links
            Lý do dùng: Tự động collapse trên mobile, expand trên desktop */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* REACT BOOTSTRAP NAV COMPONENT
              Nav: Container cho navigation links
              className="me-auto": Margin end auto để đẩy items về bên phải
              Lý do dùng Nav: Consistent styling và accessibility
              Có thể thay bằng: <ul className="navbar-nav me-auto"> */}
          <Nav className="me-auto">
            {/* REACT BOOTSTRAP NAV LINK
                Nav.Link: Individual navigation link
                active: Bootstrap class cho active state
                Lý do dùng: Proper styling và accessibility
                Có thể thay bằng: <a className="nav-link active"> */}
            <Nav.Link 
              href="#" 
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => handleNavigation('home')}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="#" 
              className={currentPage === 'movies' ? 'active' : ''}
              onClick={() => handleNavigation('movies')}
            >
              Movies
            </Nav.Link>
            <Nav.Link 
              href="#" 
              className={currentPage === 'account' ? 'active' : ''}
              onClick={() => handleNavigation('account')}
            >
              Account
            </Nav.Link>
          </Nav>

          {/* REACT BOOTSTRAP FORM COMPONENT
              Form: Wrapper cho form elements
              className="d-flex me-3": Flexbox với margin end
              Lý do dùng Form: Consistent form styling và validation
              Có thể thay bằng: <form className="d-flex me-3"> */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            {/* REACT BOOTSTRAP INPUT GROUP
                InputGroup: Group input với buttons/addons
                Lý do dùng: Proper spacing và alignment
                Có thể thay bằng: <div className="input-group"> */}
            <InputGroup>
              {/* REACT BOOTSTRAP FORM CONTROL
                  Form.Control: Input field với Bootstrap styling
                  type="text": Text input (có thể thay bằng type="email", type="password")
                  Lý do dùng: Consistent input styling và validation
                  Có thể thay bằng: <input className="form-control" type="text"> */}
              <Form.Control
                type="text"
                placeholder="Quick search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {/* REACT BOOTSTRAP BUTTON
                  Button: Clickable button component
                  variant="outline-light": Outline style với màu sáng
                  Có thể thay bằng: variant="primary", variant="secondary", variant="success"
                  type="submit": Form submission
                  Lý do dùng: Consistent button styling và behavior
                  Có thể thay bằng: <button className="btn btn-outline-light" type="submit"> */}
              <Button variant="outline-light" type="submit">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>

          {/* Right side icons and dropdowns */}
          <div className="d-flex align-items-center gap-3">
            {/* REACT BOOTSTRAP BUTTON - FAVOURITES
                Button với variant="outline-light"
                Có thể thay bằng: variant="primary", variant="secondary", variant="info" */}
            <Button variant="outline-light" className="icon-btn">
              <i className="bi bi-heart"></i> Favourites
            </Button>

            {/* REACT BOOTSTRAP BUTTON - LOGIN
                Button với variant="outline-light"
                Có thể thay bằng: variant="success", variant="warning", variant="danger" */}
            <Button variant="outline-light" className="icon-btn">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Button>

            {/* REACT BOOTSTRAP DROPDOWN
                Dropdown: Dropdown menu component
                Lý do dùng: Proper dropdown behavior và accessibility
                Có thể thay bằng: Custom dropdown với Bootstrap classes */}
            <Dropdown>
              {/* REACT BOOTSTRAP DROPDOWN TOGGLE
                  Dropdown.Toggle: Button để mở dropdown
                  variant="outline-light": Button style
                  id: Unique identifier cho accessibility */}
              <Dropdown.Toggle variant="outline-light" id="accounts-dropdown" className="icon-btn">
                <i className="bi bi-gear"></i> Accounts
              </Dropdown.Toggle>
              {/* REACT BOOTSTRAP DROPDOWN MENU
                  Dropdown.Menu: Container cho dropdown items */}
              <Dropdown.Menu>
                {/* REACT BOOTSTRAP DROPDOWN ITEM
                    Dropdown.Item: Individual menu item
                    href: Link destination
                    Có thể thay bằng: <a className="dropdown-item" href="#"> */}
                <Dropdown.Item href="#manage-profiles">
                  <i className="bi bi-person-gear me-2"></i>Manage Your Profiles
                </Dropdown.Item>
                <Dropdown.Item href="#build-account">
                  <i className="bi bi-person-plus me-2"></i>Build your Account
                </Dropdown.Item>
                {/* REACT BOOTSTRAP DROPDOWN DIVIDER
                    Dropdown.Divider: Separator line
                    Có thể thay bằng: <hr className="dropdown-divider"> */}
                <Dropdown.Divider />
                <Dropdown.Item href="#change-password">
                  <i className="bi bi-key me-2"></i>Change Password
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </div>
      </Navbar>
    </>
  );
}
