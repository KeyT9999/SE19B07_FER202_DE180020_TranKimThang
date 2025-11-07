import React from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";

function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price / 23000);
    }
    const priceNum = parseFloat(String(price).replace(/[^\d]/g, "").replace(/\./g, ""));
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(priceNum / 23000);
  };

  const getSubtotal = (item) => {
    const price = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(String(item.price).replace(/[^\d]/g, "").replace(/\./g, ""));
    return price * item.quantity;
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id);
  };

  if (items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Add some mobiles to your cart to see them here.</p>
          <Button variant="primary" onClick={() => navigate("/mobiles")}>
            Browse Mobiles
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Your Cart</h1>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Name</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Price</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Quantity</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Subtotal</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>
                <strong>{item.name}</strong>
              </td>
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>{formatPrice(item.price)}</td>
              <td style={{ padding: "12px" }}>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    style={{ fontSize: "1.2rem", padding: "8px 16px" }}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item, parseInt(e.target.value) || 1)
                    }
                    style={{ width: "100px", textAlign: "center", fontSize: "1.1rem", padding: "8px" }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    style={{ fontSize: "1.2rem", padding: "8px 16px" }}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>
                <strong>{formatPrice(getSubtotal(item))}</strong>
              </td>
              <td style={{ padding: "12px" }}>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => handleRemoveFromCart(item)}
                  style={{ fontSize: "1rem", padding: "8px 16px" }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end" style={{ fontSize: "1.2rem", padding: "16px" }}>
              <strong>Total:</strong>
            </td>
            <td colSpan="2" style={{ fontSize: "1.5rem", padding: "16px" }}>
              <strong className="text-success">
                {formatPrice(getTotalPrice())}
              </strong>
            </td>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="secondary" 
          onClick={() => navigate("/mobiles")}
          style={{ fontSize: "1.1rem", padding: "12px 24px" }}
        >
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}

CartPage.propTypes = {};

export default CartPage;

