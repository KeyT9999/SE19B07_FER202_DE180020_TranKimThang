/**
 * ProductsPage.jsx - Trang danh sách sản phẩm
 * 
 * MỤC ĐÍCH:
 * - Hiển thị danh sách tất cả sản phẩm với filter và search
 * - Render ProductList component
 * 
 * ROUTE: /products
 * CONTEXTS: ProductContext (products, loading, error)
 */

import React from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import ProductList from "../components/products/ProductList";
import { useProducts } from "../context/ProductContext";

const ProductsPage = () => {
  // Lấy danh sách sản phẩm từ ProductContext
  const { products, loading, error } = useProducts();

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <>
      <Container className="mt-5" style={{ maxWidth: "1200px" }}>
        <h1 className="products-main-title">Products</h1>
        <ProductList products={products} />
      </Container>
    </>
  );
};

export default ProductsPage;
