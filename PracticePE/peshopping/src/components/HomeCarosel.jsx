/**
 * FILE: HomeCarosel.jsx
 * TÁC DỤNG: Component hiển thị carousel (slideshow) các sản phẩm trên trang chủ
 * FOLDER: src/components/ - Chứa các components tái sử dụng được
 * 
 * GIAO DIỆN:
 * ┌─────────────────────────────┐
 * │  [◀] [Hình SP1] [▶]          │ ← Carousel tự động chuyển slide
 * │                              │
 * │  [Hình SP2]                  │
 * │                              │
 * │  [Hình SP3]                  │
 * └─────────────────────────────┘
 * 
 * MAPPING:
 * HomePage → HomeCarosel → useStoreState() → store.products → map() → Carousel.Item
 * 
 * DATA FLOW:
 * StoreContext → useStoreState() → store.products → map() → hiển thị hình ảnh
 */

// Import React
import React from "react";

// Import Carousel từ react-bootstrap để tạo slideshow
import { Carousel } from "react-bootstrap";

// Import useStoreState để lấy dữ liệu sản phẩm từ Context
import { useStoreState } from "../context/storeContext";

/**
 * HomeCarosel Component - Hiển thị carousel các sản phẩm
 * @returns {JSX.Element|null} - JSX chứa carousel hoặc null nếu không có dữ liệu
 */
export default function HomeCarosel() {
  // Lấy state từ StoreContext
  // useStoreState() trả về { store: { products: [...] }, loading: false }
  const { store } = useStoreState();
  
  // Log ra console để debug
  console.log("store", store);
  
  // Kiểm tra: Nếu không có sản phẩm hoặc mảng rỗng thì không render
  // !Array.isArray(): Kiểm tra xem có phải mảng không
  // store.products.length === 0: Kiểm tra mảng có rỗng không
  // ||: OR operator - nếu một trong hai điều kiện đúng thì return null
  if (!Array.isArray(store.products) || store.products.length === 0)
    return null; // Không render gì cả (tránh lỗi khi map() trên undefined/null)
  
  // Render carousel
  return (
    // Carousel: Bootstrap carousel component
    // interval={3000}: Tự động chuyển slide sau 3 giây (3000ms)
    // data-bs-theme="dark": Theme tối cho carousel (nút điều hướng màu trắng)
    <Carousel interval={3000} data-bs-theme="dark">
      {/* map(): Duyệt qua mảng products và tạo Carousel.Item cho mỗi sản phẩm */}
      {store.products.map((p) => (
        // Carousel.Item: Mỗi slide trong carousel
        // key={p.id}: React cần key để nhận biết từng item
        <Carousel.Item key={p.id}>
          {/* <img>: Hiển thị hình ảnh sản phẩm */}
          <img
            className="d-block w-100" // Bootstrap classes: d-block (display block), w-100 (width 100%)
            src={p.img} // src: Đường dẫn hình ảnh từ product object (ví dụ: "/img/picture1.jpg")
            alt={p.name} // alt: Text mô tả hình ảnh (cho accessibility và SEO)
            // style: Inline CSS để định dạng kích thước
            style={{ height: 420, objectFit: "cover" }}
            // height: 420: Chiều cao cố định 420px
            // objectFit: "cover": Cắt hình để vừa khung, không bị méo
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
