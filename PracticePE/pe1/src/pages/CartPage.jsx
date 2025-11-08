import React from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price / 23000);
    }
    // If price is string, try to parse it
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
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>{formatPrice(item.price)}</td>
              <td>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
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
                    style={{ width: "80px", textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>
                <strong>{formatPrice(getSubtotal(item))}</strong>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              <strong>Total:</strong>
            </td>
            <td colSpan="2">
              <strong className="fs-4 text-success">
                {formatPrice(getTotalPrice())}
              </strong>
            </td>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate("/mobiles")}>
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}

export default CartPage;

