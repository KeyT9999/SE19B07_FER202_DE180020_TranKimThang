import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const FilterBar = () => {
  const { filters, setFilters, availableCategories } = useExpense();

  const handleCategoryChange = (event) => {
    setFilters({ category: event.target.value });
  };

  const handleClear = () => {
    setFilters({ category: '' });
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header as="h5">Filter</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="categoryFilter">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              list="category-filter-options"
              placeholder="Category (e.g., Food)"
              value={filters.category}
              onChange={handleCategoryChange}
            />
            <datalist id="category-filter-options">
              {availableCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="outline-secondary"
              size="sm"
              type="button"
              onClick={handleClear}
              disabled={!filters.category}
            >
              Clear filter
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FilterBar;
