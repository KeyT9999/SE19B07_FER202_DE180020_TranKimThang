import React from 'react';
import PropTypes from 'prop-types';
import { Carousel as BootstrapCarousel } from 'react-bootstrap';

const Carousel = ({ items }) => {
  // Show nothing if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <BootstrapCarousel className="mb-5">
      {items.map((item) => (
        <BootstrapCarousel.Item key={item.id}>
          <div 
            style={{
              height: '400px',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '40px',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              backgroundColor: '#007bff' // Fallback color if image doesn't load
            }}
          >
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                {item.title}
              </h1>
              <p style={{ fontSize: '1.2rem' }}>{item.description}</p>
            </div>
          </div>
        </BootstrapCarousel.Item>
      ))}
    </BootstrapCarousel>
  );
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Carousel;
