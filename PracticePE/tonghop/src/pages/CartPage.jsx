/**
 * CartPage.jsx - Trang hiển thị giỏ hàng
 * 
 * MỤC ĐÍCH:
 * - Hiển thị danh sách sản phẩm trong giỏ hàng
 * - Cho phép user update quantity, remove items
 * - Hiển thị tổng tiền
 * 
 * ROUTE: /cart
 * CONTEXTS: CartContext (items, updateQuantity, removeFromCart, getTotalPrice)
 */

import React from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { assetUrl } from "../utils/format";

function CartPage() {
  // Lấy state và functions từ CartContext
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  /**
   * getSubtotal - Tính tổng tiền của một item (price * quantity)
   */
  const getSubtotal = (item) => {
    const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
    return price * item.quantity;
  };

  /**
   * handleUpdateQuantity - Xử lý khi user thay đổi quantity
   * Nếu quantity <= 0 → remove item khỏi cart
   */
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  /**
   * handleRemoveFromCart - Xử lý khi user click nút Remove
   */
  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id);
  };

  if (items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Giỏ hàng của bạn đang trống</Alert.Heading>
          <p>Thêm một số sản phẩm vào giỏ hàng để xem chúng ở đây.</p>
          <Button variant="primary" onClick={() => navigate("/products")}>
            Xem sản phẩm
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "1200px" }}>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Giỏ hàng của bạn</h1>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Hình ảnh</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Tên sản phẩm</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Giá</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Số lượng</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Tổng tiền</th>
            <th style={{ fontSize: "1.1rem", padding: "12px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: "12px" }}>
                <img
                  src={assetUrl(item.image)}
                  alt={item.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </td>
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>
                <strong>{item.name}</strong>
              </td>
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>
                {formatPrice(item.price)}
              </td>
              <td style={{ padding: "12px" }}>
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
              <td style={{ fontSize: "1.1rem", padding: "12px" }}>
                <strong>{formatPrice(getSubtotal(item))}</strong>
              </td>
              <td style={{ padding: "12px" }}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-end" style={{ fontSize: "1.2rem", padding: "16px" }}>
              <strong>Tổng cộng:</strong>
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
          onClick={() => navigate("/products")}
        >
          Tiếp tục mua sắm
        </Button>
        <Button variant="primary" size="lg">
          Thanh toán
        </Button>
      </div>
    </Container>
  );
}

export default CartPage;

