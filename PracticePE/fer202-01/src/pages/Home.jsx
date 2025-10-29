import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Carousel from '../components/Carousel';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    // Load data từ JSON Server nếu có, nếu không thì dùng import
    const loadCarouselData = async () => {
      try {
        // Thử load từ JSON Server
        const response = await fetch('http://localhost:3000/carousel');
        if (response.ok) {
          const data = await response.json();
          setCarouselItems(data);
          return;
        }
      } catch (err) {
        console.log('JSON Server không chạy, sử dụng dữ liệu tĩnh');
      }
      
      // Nếu JSON Server không chạy, import từ db.json
      try {
        const dbData = await import('../data/db.json');
        if (dbData.default && dbData.default.carousel) {
          setCarouselItems(dbData.default.carousel);
        }
      } catch (err) {
        console.error('Error loading carousel data:', err);
      }
    };

    loadCarouselData();
  }, []);

  const handleBrowseMobileShop = () => {
    navigate('/mobiles');
  };

  return (
    <div>
      <Carousel items={carouselItems} />
      <Container>
        <div className="text-center mb-5">
          <h1 className="mb-3">Welcome to Our Shop</h1>
          <p className="text-muted mb-4">
            The best place to buy mobile shop online with great offers and quality products.
          </p>
          <Button variant="primary" size="lg" onClick={handleBrowseMobileShop}>
            Browse mobile shop <FaArrowRight className="ms-2" />
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
