import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const FilterBar = () => {
  const { filters, setFilters = [], availableCategorys = [] } = useExpense();

  const handleChange = (name) => (event) => {
    setFilters({ [name]: event.target.value });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5">Filter</Card.Header>
      <Card.Body>
        <Form>
          <Row className="g-3">
      
        

            {/* Filter by Category name */}
            <Col xs={5} md={5} lg={6}>
              <Form.Group controlId="categoryFilter">
                <Form.Label>Lọc theo Category</Form.Label>
                <Form.Select value={filters.category} onChange={handleChange('category')}>
                  <option value="">All Categorys</option>
                  {availableCategorys.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            

            {/* Sorting */}
            <Col xs={5} md={5} lg={6}>
              <Form.Group controlId="sortBy">
                <Form.Label>Sắp xếp theo:</Form.Label>
                <Form.Select value={filters.sortBy} onChange={handleChange('sortBy')}>
                  <option value="category_asc">Category name ascending</option>
                  <option value="category_desc">Category name descending</option>
                  <option value="date_asc">Date ascending</option>
                  <option value="date_desc">Date descending</option>
                  <option value="amount_asc">Amount ascending</option>
                  <option value="amount_desc">Amount descending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FilterBar;
