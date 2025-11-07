// src/components/ui/Hero.js

import React from "react";
import { Button, Carousel, Nav } from "react-bootstrap";
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { useProducts } from "../../context/ProductContext";
import { Link } from 'react-router-dom';
import config from "../../config";
const Hero = () => {
  const { products } = useProducts();

  const heroProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <div>    <Carousel>
      {heroProducts.map((product) => (
        <Carousel.Item
          key={config.getField("productId", product)}
          interval={2000}
        >
          <img
            className="d-block w-100"
            style={{ height: "60vh", objectFit: "cover" }}
            src={config.getField("productImage", product)}
            alt={config.getField("productTitle", product)}
          />
          <Carousel.Caption className="hero-caption">
            <h3>{config.getField("productTitle", product)}</h3>
            <p>{config.getField("productDescription", product)}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
      <div style={{ display: "flex", flexDirection: "column", width: '100%', justifyContent: 'center', alignItems: 'center' }}><h1> Welcome to Our Shop </h1>
        <p>The best place to buy mobile shop online with great offers and quality products.</p>

        <Nav.Link as={Link} to="/products" className="d-flex align-items-center me-3">
          <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "20px" }}>Browse mobile shop<FaArrowAltCircleRight ></FaArrowAltCircleRight> </Button>
        </Nav.Link></div>
    </div>
  );
};

export default Hero;
