/**
 * CategoriesSection Component
 * Display restaurant categories
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import './CategoriesSection.css';

function CategoriesSection() {
  const categories = [
    { icon: 'fas fa-utensils', name: 'Fine Dining', count: '45 nhà hàng' },
    { icon: 'fas fa-pizza-slice', name: 'Casual Dining', count: '128 nhà hàng' },
    { icon: 'fas fa-coffee', name: 'Café & Bistro', count: '67 nhà hàng' },
    { icon: 'fas fa-building', name: 'Rooftop', count: '23 nhà hàng' },
  ];

  return (
    <section className="categories-section" id="categories">
      <Container>
        <div className="section-header">
          <h2 className="section-title">Khám phá theo loại hình</h2>
          <p className="section-subtitle">Tìm nhà hàng phù hợp với sở thích của bạn</p>
        </div>
        
        <div className="category-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">
                <i className={category.icon}></i>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-count">{category.count}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default CategoriesSection;

