/**
 * FILE: FoodDetail.jsx
 * TÁC DỤNG: Component hiển thị thông tin chi tiết 1 sản phẩm dạng card
 * FOLDER: src/components/ - Chứa các components tái sử dụng được
 * 
 * GIAO DIỆN:
 * ┌──────────────┐
 * │  [Hình SP]   │ ← Hình ảnh sản phẩm
 * ├──────────────┤
 * │  Tên SP      │ ← Tên sản phẩm
 * │  Giá: 71240  │ ← Giá tiền
 * │  Số lượng: 18│ ← Số lượng còn lại
 * ├──────────────┤
 * │ [Mua ngay]   │ ← Nút mua hàng (màu xanh)
 * └──────────────┘
 * 
 * MAPPING:
 * StorePage → map products → FoodDetail (mỗi sản phẩm = 1 card)
 * 
 * DATA FLOW:
 * StorePage → FoodDetail (prop product) → hiển thị thông tin → onClick → handleCreateOrUpdate → update stock
 * 
 * TƯƠNG TÁC:
 * - Khi click "Mua ngay": Giảm stock đi 1, cập nhật lên server
 */

// Import React
import React from "react";

// Import Card, Button từ react-bootstrap để tạo card và nút bấm
import { Card, Button } from "react-bootstrap";

// Import useStoreDispatch để lấy function cập nhật sản phẩm
import { useStoreDispatch } from "../context/storeContext";

/**
 * FoodDetail Component - Hiển thị thông tin 1 sản phẩm dạng card
 * @param {Object} props - Props object
 * @param {Object} props.product - Object chứa thông tin sản phẩm:
 *   - id: ID sản phẩm
 *   - name: Tên sản phẩm
 *   - img: Đường dẫn hình ảnh
 *   - price: Giá tiền
 *   - stock: Số lượng còn lại
 * @returns {JSX.Element} - JSX chứa card sản phẩm
 */
export default function FoodDetail({ product }) {
  // Lấy handleCreateOrUpdate từ StoreDispatchContext
  // useStoreDispatch() trả về { dispatch, fetchStore, handleCreateOrUpdate }
  const { handleCreateOrUpdate } = useStoreDispatch();

  /**
   * Hàm handleBuy: Xử lý khi người dùng click nút "Mua ngay"
   * TÁC DỤNG:
   * 1. Kiểm tra còn hàng không (stock > 0)
   * 2. Nếu còn: Giảm stock đi 1, cập nhật lên server
   * 3. Nếu hết: Hiển thị alert "Sản phẩm đã hết hàng"
   */
  const handleBuy = () => {
    // Kiểm tra: Nếu stock > 0 (còn hàng)
    if (product.stock > 0) {
      // Tạo object sản phẩm mới với stock giảm đi 1
      // ...product: Copy tất cả properties của product cũ
      // stock: product.stock - 1: Giảm stock đi 1
      const newProduct = { ...product, stock: product.stock - 1 };
      
      // Gọi handleCreateOrUpdate để cập nhật sản phẩm
      // newProduct: Dữ liệu sản phẩm mới (đã giảm stock)
      // true: isEditing = true (đang cập nhật sản phẩm có sẵn)
      // newProduct.id: ID của sản phẩm đang cập nhật
      handleCreateOrUpdate(newProduct, true, newProduct.id);
    } else {
      // Nếu hết hàng (stock = 0), hiển thị alert
      alert("Sản phẩm đã hết hàng");
    }
  };

  // Render card sản phẩm
  return (
    // Card: Bootstrap card component
    // className="mb-3": margin-bottom = 3 units (khoảng cách giữa các card)
    // className="p-0": padding = 0 (không có padding)
    // className="align-items-center": Căn giữa các items theo trục ngang
    // className="text-center": Căn giữa text
    // className="bg-light": Background màu sáng
    // className="gap-2": Khoảng cách giữa các elements = 2 units
    // className="rounded-0": Bo góc = 0 (góc vuông)
    <Card className="mb-3 p-0 align-items-center text-center bg-light gap-2 rounded-0">
      {/* Card.Img: Hiển thị hình ảnh sản phẩm */}
      <Card.Img
        src={product.img} // src: Đường dẫn hình ảnh (ví dụ: "/img/picture1.jpg")
        alt={product.name} // alt: Text mô tả hình ảnh
        className="card-img-top" // Bootstrap class: hình ở trên cùng của card
        // style: Inline CSS
        style={{
          width: "100%", // Chiều rộng 100% của card
          height: "200px", // Chiều cao cố định 200px
          objectFit: "cover", // Cắt hình để vừa khung, không bị méo
        }}
      />
      
      {/* Card.Body: Container chứa nội dung của card */}
      <Card.Body>
        {/* Card.Title: Tiêu đề card (tên sản phẩm) */}
        <Card.Title>{product.name}</Card.Title>
        
        {/* Card.Text: Text hiển thị giá */}
        {/* {product.price} VNĐ: Hiển thị giá từ product object + " VNĐ" */}
        <Card.Text>Giá: {product.price} VNĐ</Card.Text>
        
        {/* Card.Text: Text hiển thị số lượng */}
        {/* {product.stock}: Hiển thị stock từ product object */}
        <Card.Text>Số lượng: {product.stock}</Card.Text>
      </Card.Body>
      
      {/* Button: Nút "Mua ngay" */}
      {/* variant="success": Bootstrap variant màu xanh lá */}
      {/* className="w-100": Width 100% (chiếm toàn bộ chiều rộng card) */}
      {/* className="rounded-0": Bo góc = 0 */}
      {/* onClick={handleBuy}: Khi click thì gọi hàm handleBuy */}
      <Button variant="success" className="w-100 rounded-0" onClick={handleBuy}>
        Mua ngay
      </Button>
    </Card>
  );
}
