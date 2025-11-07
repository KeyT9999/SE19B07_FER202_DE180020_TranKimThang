/**
 * ProductDetailPage.jsx - Trang chi tiết sản phẩm
 * 
 * MỤC ĐÍCH:
 * - Hiển thị thông tin chi tiết của một sản phẩm
 * - Cho phép user thêm vào giỏ hàng, thêm vào yêu thích
 * 
 * ROUTE: /product/:id
 * CONTEXTS: 
 * - ProductContext: products (để tìm sản phẩm theo id)
 * - CartContext: addToCart()
 * - FavoriteContext: addToFavorite(), removeFromFavorite(), isFavorite()
 * - ToastContext: showToast()
 */

// src/pages/ProductDetailPage.js

import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";
import { useToast } from "../context/ToastContext";
import { FaShoppingCart, FaHeart, FaArrowLeft } from "react-icons/fa";
import config from "../config";
import { assetUrl } from '../utils/format';

const ProductDetailPage = () => {
  // Lấy id từ URL params (ví dụ: /product/1 → id = "1")
  const { id } = useParams();
  
  // Lấy danh sách sản phẩm từ ProductContext
  const { products, loading, error } = useProducts();
  
  // Lấy hàm addToCart từ CartContext
  const { addToCart } = useCart();
  
  // Lấy các hàm từ FavoriteContext
  const { addToFavorite, isFavorite, removeFromFavorite } = useFavorite();
  
  // Lấy hàm showToast từ ToastContext
  const { showToast } = useToast();

  if (loading) {
    return (
      <div className="text-center my-5 p-5">
        <Spinner animation="border" />
        <p>Loading Product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading products: {error}</Alert>
      </Container>
    );
  }

  const product = products.find(
    (p) => config.getField("productId", p).toString() === id
  );

  if (!product) {
    return (
      <Container className="text-center my-5">
        <Alert variant="warning">
          <h2>Product not found!</h2>
          <p>The product you are looking for might not exist.</p>
          <Button as={Link} to="/products">
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const productId = config.getField("productId", product);
  const productTitle = config.getField("productTitle", product);
  const productImage = config.getField("productImage", product);
  const productPrice = config.getField("productPrice", product);
  const productDescription = config.getField("productDescription", product);

  const handleAddToCart = () => {
    const productToAdd = {
      id: productId,
      name: productTitle,
      price: productPrice,
      image: productImage,
      description: productDescription,
    };
    
    addToCart(productToAdd);
    showToast(`${productTitle} đã được thêm vào giỏ hàng!`, "success");
  };

  const handleFavorite = () => {
    const productToFavorite = {
      id: productId,
      name: productTitle,
      price: productPrice,
      image: productImage,
      description: productDescription,
    };
    
    if (isFavorite(productId)) {
      removeFromFavorite(productId);
      showToast(`${productTitle} đã được xóa khỏi danh sách yêu thích!`, "info");
    } else {
      addToFavorite(productToFavorite);
      showToast(`${productTitle} đã được thêm vào danh sách yêu thích!`, "success");
    }
  };

  const isFavorited = isFavorite(productId);

  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={11} lg={10}>
            <Card className="product-detail-card flex-md-row">
              <Col md={6} className="p-3">
                <div className="position-relative">
                  <Image
                    src={assetUrl(productImage)}
                    alt={productTitle}
                    className="product-detail-image"
                  />

                </div>
              </Col>
              <Col md={6} className="d-flex flex-column product-detail-content">
                <div className="product-detail-price">
                  <span className="text-success fs-5">
                    ${productPrice}
                  </span>
                </div>
                <h1 className="product-detail-title">{productTitle}</h1>
                <p className="product-detail-description">
                  {productDescription}
                </p>

                <div className="product-detail-actions mt-auto d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart className="me-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant={isFavorited ? "danger" : "outline-danger"}
                    className="flex-fill"
                    onClick={handleFavorite}
                  >
                    <FaHeart className="me-2" /> {isFavorited ? "Favorited" : "Favorite"}
                  </Button>

                  <Link
                    to="/products"
                    className="btn btn-link mt-3 align-self-start"
                  >
                    <FaArrowLeft className="me-2" />
                    Back to List
                  </Link>
                </div>
              </Col>

            </Card>
          </Col>
        </Row>
      </Container>

    </>
  );
};

export default ProductDetailPage;