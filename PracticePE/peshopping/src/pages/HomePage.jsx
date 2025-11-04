/**
 * FILE: HomePage.jsx
 * TÁC DỤNG: Trang chủ của ứng dụng, hiển thị carousel các sản phẩm
 * FOLDER: src/pages/ - Chứa các trang (pages) chính của ứng dụng
 * 
 * GIAO DIỆN:
 * ┌─────────────────────────────┐
 * │   Container (căn giữa)      │
 * │                             │
 * │   HomeCarosel               │ ← Carousel hiển thị hình ảnh sản phẩm
 * │   (Tự động chuyển slide)    │
 * │                             │
 * └─────────────────────────────┘
 * 
 * MAPPING:
 * App.js → Route "/" → HomePage → HomeCarosel → hiển thị products từ Context
 */

// Import component HomeCarosel để hiển thị carousel
import HomeCarosel from "../components/HomeCarosel";

/**
 * HomePage Component - Trang chủ
 * @returns {JSX.Element} - JSX chứa carousel
 */
export default function HomePage() {
  return (
    // Container: Bootstrap class để căn giữa nội dung
    // mt-4: margin-top (khoảng cách phía trên)
    // mb-4: margin-bottom (khoảng cách phía dưới)
    <div className="container mt-4 mb-4">
      {/* HomeCarosel: Component hiển thị carousel các sản phẩm */}
      {/* Component này sẽ tự động lấy dữ liệu từ StoreContext */}
      <HomeCarosel />
    </div>
  );
}
