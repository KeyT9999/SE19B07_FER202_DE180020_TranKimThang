/**
 * HomePage.jsx - Trang chủ
 * 
 * MỤC ĐÍCH:
 * - Hiển thị Hero component (carousel sản phẩm)
 * - Trang đầu tiên user thấy khi vào website
 * 
 * ROUTE: /home (hoặc /)
 * CONTEXTS: ProductContext (loading, error - để check trạng thái fetch)
 */

import React from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import Hero from "../components/ui/Hero";
import { useProducts } from "../context/ProductContext";

const HomePage = () => {
  // Chỉ cần loading và error để check trạng thái
  // products được sử dụng trong Hero component
  const { loading, error } = useProducts();

  if (loading)
    return (
      <div className="text-center my-5 p-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <>
      <Hero />
      <Container
        className="my-5"
        style={{ margin: "0 auto", maxWidth: "1200px" }}
      >
        {/* <ProductList products={products} /> */}
      </Container>
    </>
  );
};

export default HomePage;
