/**
 * RestaurantSearch Component
 * Search and filter component for restaurants
 */

import React, { useState } from 'react';
import { Form, InputGroup, Button, FormControl } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { CUISINE_TYPES } from '../../utils/constants';
import './RestaurantSearch.css';

function RestaurantSearch({ onSearch, onFilterChange, searchTerm, selectedCuisine }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchTerm);
    }
  };

  const handleCuisineChange = (e) => {
    if (onFilterChange) {
      onFilterChange({ cuisine: e.target.value });
    }
  };

  return (
    <div className="restaurant-search">
      <Form onSubmit={handleSubmit} className="search-form">
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            placeholder="Tìm kiếm nhà hàng, địa chỉ, loại món ăn..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="search-input"
          />
          <Button variant="primary" type="submit">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>

      <div className="filters">
        <Form.Group className="filter-group">
          <Form.Label>
            <FaFilter /> Loại món ăn
          </Form.Label>
          <Form.Select
            value={selectedCuisine || ''}
            onChange={handleCuisineChange}
            className="filter-select"
          >
            <option value="">Tất cả</option>
            {CUISINE_TYPES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </div>
  );
}

export default RestaurantSearch;

