import React from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import MotorbikeAPI from "../api/MotorbikeAPI";

function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(item);
      return;
    }

    const quantityDiff = newQuantity - item.quantity;
    
    try {
      // Update stock in JSON Server
      const currentItem = await MotorbikeAPI.get(`/motobikes/${item.id}`);
      const newStock = currentItem.data.quantity - quantityDiff;
      
      if (newStock < 0) {
        alert("Không đủ hàng trong kho!");
        return;
      }

      await MotorbikeAPI.patch(`/motobikes/${item.id}`, {
        quantity: newStock,
      });

      updateQuantity(item.id, newQuantity);
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
    }
  };

  const handleRemoveFromCart = async (item) => {
    try {
      // Restore stock in JSON Server
      const currentItem = await MotorbikeAPI.get(`/motobikes/${item.id}`);
      await MotorbikeAPI.patch(`/motobikes/${item.id}`, {
        quantity: currentItem.data.quantity + item.quantity,
      });

      removeFromCart(item.id);
    } catch (err) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", err);
      alert("Không thể xóa khỏi giỏ hàng. Vui lòng thử lại.");
    }
  };

  const formatPrice = (priceString) => {
    const price = parseFloat(
      priceString.replace(/[^\d]/g, "").replace(/\./g, "")
    );
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getSubtotal = (item) => {
    const price = parseFloat(
      item.price.replace(/[^\d]/g, "").replace(/\./g, "")
    );
    return price * item.quantity;
  };

  if (items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Add some motorbikes to your cart to see them here.</p>
          <Button variant="primary" onClick={() => navigate("/motorbikes")}>
            Go to Motorbikes List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h1 className="display-5">Your Cart</h1>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Model</th>
            <th>Price</th>
            <th>Qty</th>
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
              <td>{item.price}</td>
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
                <strong>{formatPrice(getSubtotal(item).toString())}</strong>
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
                {formatPrice(getTotalPrice().toString())}
              </strong>
            </td>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate("/motorbikes")}>
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}

export default CartPage;
