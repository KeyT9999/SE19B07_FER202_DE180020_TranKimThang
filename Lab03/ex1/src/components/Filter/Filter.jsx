import React, { useState } from 'react';
// REACT BOOTSTRAP IMPORTS - Import các component cần thiết
// Card: Container với border và shadow
// Form: Form wrapper với validation
// InputGroup: Group input với addons
// Button: Clickable button component
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import './Filter.css';

export default function Filter({ onSearch, onFilter, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterYear(value);
    onFilter(value);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterYear('');
    setSortBy('');
    onSearch('');
    onFilter('');
    onSort('');
  };

  return (
    <>
      {/* REACT BOOTSTRAP CARD COMPONENT
          Card: Container với border, shadow và padding
          className="filter-card mb-4": Custom styling + margin bottom
          Lý do dùng Card: Cung cấp consistent container styling
          Có thể thay bằng: <div className="card filter-card mb-4"> */}
      <Card className="filter-card mb-4">
        {/* REACT BOOTSTRAP CARD HEADER
            Card.Header: Header section của card
            Lý do dùng: Consistent header styling với border bottom
            Có thể thay bằng: <div className="card-header"> */}
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>Search & Filter Movies
          </h5>
        </Card.Header>
        {/* REACT BOOTSTRAP CARD BODY
            Card.Body: Main content area của card
            Lý do dùng: Consistent padding và content styling
            Có thể thay bằng: <div className="card-body"> */}
        <Card.Body>
          {/* Bootstrap Grid System
              className="row g-3": Bootstrap grid với gap
              g-3: Gap size (có thể thay bằng g-1, g-2, g-4, g-5) */}
          <div className="row g-3">
            {/* Search Section
                col-md-4: Responsive column (4/12 width trên medium+ screens)
                Có thể thay bằng: col-sm-6, col-lg-3, col-xl-2 */}
            <div className="col-md-4">
              {/* REACT BOOTSTRAP FORM LABEL
                  Form.Label: Label cho form elements
                  Lý do dùng: Consistent label styling và accessibility
                  Có thể thay bằng: <label className="form-label"> */}
              <Form.Label>
                <i className="bi bi-search me-1"></i>Search
              </Form.Label>
              {/* REACT BOOTSTRAP INPUT GROUP
                  InputGroup: Group input với addons (icons, buttons)
                  Lý do dùng: Proper alignment và spacing
                  Có thể thay bằng: <div className="input-group"> */}
              <InputGroup>
                {/* REACT BOOTSTRAP INPUT GROUP TEXT
                    InputGroup.Text: Addon text/icon bên trái input
                    Lý do dùng: Consistent addon styling
                    Có thể thay bằng: <span className="input-group-text"> */}
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                {/* REACT BOOTSTRAP FORM CONTROL
                    Form.Control: Input field với Bootstrap styling
                    type="text": Text input (có thể thay bằng type="email", type="password", type="search")
                    Lý do dùng: Consistent input styling và validation
                    Có thể thay bằng: <input className="form-control" type="text"> */}
                <Form.Control
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {/* REACT BOOTSTRAP BUTTON
                    Button: Clickable button component
                    variant="outline-secondary": Outline style với màu secondary
                    Có thể thay bằng: variant="outline-primary", variant="outline-danger", variant="secondary"
                    onClick: Event handler
                    Lý do dùng: Consistent button styling và behavior
                    Có thể thay bằng: <button className="btn btn-outline-secondary" onClick={clearFilters}> */}
                <Button variant="outline-secondary" onClick={clearFilters}>
                  <i className="bi bi-x-lg"></i> Clear
                </Button>
              </InputGroup>
            </div>

            {/* Filter by Year Section */}
            <div className="col-md-4">
              <Form.Label>
                <i className="bi bi-calendar me-1"></i>Filter by Year
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-calendar"></i>
                </InputGroup.Text>
                {/* REACT BOOTSTRAP FORM SELECT
                    Form.Select: Dropdown select với Bootstrap styling
                    Lý do dùng: Consistent select styling và accessibility
                    Có thể thay bằng: <select className="form-select"> */}
                <Form.Select value={filterYear} onChange={handleFilter}>
                  <option value="">All Years</option>
                  <option value="old">≤ 2000</option>
                  <option value="medium">2001 - 2015</option>
                  <option value="new">> 2015</option>
                </Form.Select>
              </InputGroup>
            </div>

            {/* Sort Section */}
            <div className="col-md-4">
              <Form.Label>
                <i className="bi bi-sort-alpha-down me-1"></i>Sort by
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-arrow-up-down"></i>
                </InputGroup.Text>
                {/* REACT BOOTSTRAP FORM SELECT
                    Form.Select: Dropdown với các options sắp xếp
                    Có thể thêm các options khác như: "Rating ↑/↓", "Popularity ↑/↓" */}
                <Form.Select value={sortBy} onChange={handleSort}>
                  <option value="">Default</option>
                  <option value="year-asc">Year ↑</option>
                  <option value="year-desc">Year ↓</option>
                  <option value="title-asc">Title A→Z</option>
                  <option value="title-desc">Title Z→A</option>
                  <option value="duration-asc">Duration ↑</option>
                  <option value="duration-desc">Duration ↓</option>
                </Form.Select>
              </InputGroup>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
