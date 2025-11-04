/**
 * FILE: StorePage.jsx
 * TÁC DỤNG: Trang hiển thị danh sách tất cả sản phẩm dạng grid
 * FOLDER: src/pages/ - Chứa các trang (pages) chính của ứng dụng
 * 
 * GIAO DIỆN:
 * ┌─────────────────────────────┐
 * │   Container                  │
 * │   ┌─────┬─────┬─────┐       │
 * │   │ P1  │ P2  │ P3  │       │ ← Grid layout (hàng ngang)
 * │   │Card │Card │Card │       │
 * │   └─────┴─────┴─────┘       │
 * │   ┌─────┬─────┬─────┐       │
 * │   │ P4  │ P5  │ P6  │       │
 * │   └─────┴─────┴─────┘       │
 * └─────────────────────────────┘
 * 
 * MAPPING:
 * App.js → Route "/store" → StorePage → map products → FoodDetail components
 * 
 * DATA FLOW:
 * StoreContext → useStoreState() → store.products → map() → FoodDetail
 */

// Import useStoreState để lấy dữ liệu từ Context
import { useStoreState } from "../context/storeContext";

// Import Row, Col từ react-bootstrap để tạo grid layout
import { Row, Col } from "react-bootstrap";

// Import FoodDetail component để hiển thị từng sản phẩm
import FoodDetail from "../components/FoodDetail";

/**
 * StorePage Component - Trang cửa hàng hiển thị danh sách sản phẩm
 * @returns {JSX.Element} - JSX chứa grid các sản phẩm
 */
export default function StorePage() {
  // Lấy state từ StoreContext
  // useStoreState() trả về { store: { products: [...] }, loading: false }
  const { store } = useStoreState();
  
  // Log ra console để debug (xem dữ liệu có đúng không)
  console.log("store", store);
  
  return (
    // Container: Bootstrap class để căn giữa và giới hạn chiều rộng
    // mt-4: margin-top
    // mb-4: margin-bottom
    <div className="container mt-4 mb-4">
      {/* Row: Bootstrap row - hàng ngang chứa các cột */}
      <Row>
        {/* Kiểm tra store.products có phải array và có dữ liệu không */}
        {/* Array.isArray(): Kiểm tra xem có phải mảng không */}
        {/* &&: Nếu đúng thì mới render phần sau */}
        {Array.isArray(store.products) && store.products.map((product) => (
          // Col: Bootstrap column - mỗi sản phẩm là một cột
          // key: React cần key để nhận biết từng item khi render list
          // product.id: ID duy nhất của sản phẩm
          <Col key={product.id}>
            {/* FoodDetail: Component hiển thị thông tin 1 sản phẩm */}
            {/* product: Truyền prop product vào component */}
            <FoodDetail product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
