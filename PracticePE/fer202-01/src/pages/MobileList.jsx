import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import MobileCard from '../components/MobileCard';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import axios from 'axios';

const MobileList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Name A-Z');

  useEffect(() => {
    fetchMobiles();
  }, []);

  useEffect(() => {
    filterAndSortMobiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, sortBy, mobiles]);

  const fetchMobiles = async () => {
    try {
      // Thử fetch từ JSON Server
      const response = await axios.get('http://localhost:3000/mobiles');
      setMobiles(response.data);
      setFilteredMobiles(response.data);
    } catch (error) {
      console.error('Error fetching mobiles from server:', error);
      // Nếu JSON Server không chạy, load data trực tiếp
      try {
        const dbData = await import('../data/db.json');
        if (dbData.default && dbData.default.mobiles) {
          setMobiles(dbData.default.mobiles);
          setFilteredMobiles(dbData.default.mobiles);
        } else {
          setMobiles([]);
          setFilteredMobiles([]);
        }
      } catch (err) {
        console.error('Error loading local data:', err);
        setMobiles([]);
        setFilteredMobiles([]);
      }
    }
  };

  const filterAndSortMobiles = () => {
    let filtered = [...mobiles];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(mobile =>
        mobile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mobile.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (if needed in future)
    if (selectedCategory !== 'All Categories') {
      // Add category filtering logic here
    }

    // Sort mobiles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Name A-Z':
          return a.name.localeCompare(b.name);
        case 'Name Z-A':
          return b.name.localeCompare(a.name);
        case 'Price Low-High':
          return a.price - b.price;
        case 'Price High-Low':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredMobiles(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Products</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
              <option>All Categories</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>
              <FaSort />
            </InputGroup.Text>
            <Form.Select value={sortBy} onChange={handleSortChange}>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
              <option>Price Low-High</option>
              <option>Price High-Low</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {filteredMobiles.length > 0 ? (
          filteredMobiles.map((mobile) => (
            <Col key={mobile.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <MobileCard mobile={mobile} />
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center text-muted">No mobiles found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default MobileList;
