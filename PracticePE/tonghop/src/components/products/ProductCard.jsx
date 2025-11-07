/**
 * ProductCard.jsx - Component hiển thị Card sản phẩm
 * 
 * MỤC ĐÍCH:
 * - Hiển thị thông tin một sản phẩm dạng card
 * - Cho phép user xem chi tiết, thêm vào giỏ hàng, thêm vào yêu thích
 * 
 * PROPS:
 * @param {Object} product - Object sản phẩm từ API
 * 
 * CHỨC NĂNG:
 * 1. Hiển thị: hình ảnh, tên, mô tả, giá
 * 2. Nút "View Details": Navigate đến trang chi tiết sản phẩm
 * 3. Nút "Add to Cart": Thêm sản phẩm vào giỏ hàng
 * 4. Nút "Favorite": Thêm/xóa sản phẩm khỏi danh sách yêu thích
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Nhận product prop từ ProductList
 * 2. Extract thông tin sản phẩm bằng config.getField()
 * 3. Kiểm tra trạng thái favorite bằng isFavorite(productId)
 * 4. Khi user click các nút:
 *    - "View Details" → Navigate to /product/:id
 *    - "Add to Cart" → handleAddToCart() → addToCart() → showToast()
 *    - "Favorite" → handleFavorite() → addToFavorite() hoặc removeFromFavorite() → showToast()
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - ProductList.jsx: Render nhiều ProductCard trong grid layout
 * 
 * CONTEXTS SỬ DỤNG:
 * - CartContext: addToCart()
 * - FavoriteContext: addToFavorite(), removeFromFavorite(), isFavorite()
 * - ToastContext: showToast()
 */

// src/components/products/ProductCard.js

import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../../config";
import { FaHeart } from 'react-icons/fa';
import { useCart } from "../../context/CartContext";
import { useFavorite } from "../../context/FavoriteContext";
import { useToast } from "../../context/ToastContext";

/**
 * ProductCard - Component hiển thị card sản phẩm
 * 
 * @param {Object} product - Object sản phẩm từ API
 */
const ProductCard = ({ product }) => {
  // Lấy hàm addToCart từ CartContext
  const { addToCart } = useCart();
  
  // Lấy các hàm từ FavoriteContext
  const { addToFavorite, isFavorite, removeFromFavorite } = useFavorite();
  
  // Lấy hàm showToast từ ToastContext
  const { showToast } = useToast();

  // Extract thông tin sản phẩm từ product object sử dụng config.getField()
  // config.getField() giúp map field name (productId) sang key thực tế trong object (id)
  const productId = config.getField("productId", product);
  const productTitle = config.getField("productTitle", product);
  const productImage = config.getField("productImage", product);
  const productPrice = config.getField("productPrice", product);
  const productDescription = config.getField("productDescription", product);

  /**
   * handleAddToCart - Xử lý khi user click nút "Add to Cart"
   * 
   * @param {Event} e - Event object từ onClick
   * 
   * Logic:
   * 1. preventDefault() và stopPropagation() để tránh navigate (vì button có thể trong Link)
   * 2. Tạo productToAdd object với format cần thiết cho CartContext
   * 3. Gọi addToCart() để thêm vào giỏ hàng
   * 4. Hiển thị toast notification thông báo thành công
   */
  const handleAddToCart = (e) => {
    // Ngăn chặn default behavior và event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Tạo object sản phẩm với format cần thiết cho CartContext
    const productToAdd = {
      id: productId,
      name: productTitle,
      price: productPrice,
      image: productImage,
      description: productDescription,
    };
    
    // Thêm vào giỏ hàng
    addToCart(productToAdd);
    
    // Hiển thị thông báo thành công
    showToast(`${productTitle} đã được thêm vào giỏ hàng!`, "success");
  };

  /**
   * handleFavorite - Xử lý khi user click nút "Favorite"
   * 
   * @param {Event} e - Event object từ onClick
   * 
   * Logic:
   * 1. preventDefault() và stopPropagation()
   * 2. Kiểm tra xem sản phẩm đã được yêu thích chưa (isFavorite)
   * 3. Nếu đã yêu thích:
   *    → removeFromFavorite() → Xóa khỏi danh sách
   *    → showToast() thông báo "đã xóa"
   * 4. Nếu chưa yêu thích:
   *    → addToFavorite() → Thêm vào danh sách
   *    → showToast() thông báo "đã thêm"
   */
  const handleFavorite = (e) => {
    // Ngăn chặn default behavior và event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Tạo object sản phẩm với format cần thiết cho FavoriteContext
    const productToFavorite = {
      id: productId,
      name: productTitle,
      price: productPrice,
      image: productImage,
      description: productDescription,
    };
    
    // Kiểm tra trạng thái yêu thích
    if (isFavorite(productId)) {
      // Đã yêu thích → Xóa khỏi danh sách
      removeFromFavorite(productId);
      showToast(`${productTitle} đã được xóa khỏi danh sách yêu thích!`, "info");
    } else {
      // Chưa yêu thích → Thêm vào danh sách
      addToFavorite(productToFavorite);
      showToast(`${productTitle} đã được thêm vào danh sách yêu thích!`, "success");
    }
  };

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  // Dùng để thay đổi style và text của nút Favorite
  const isFavorited = isFavorite(productId);

  return (
    <Card className="h-100 product-card">
      {/* Container cho hình ảnh sản phẩm */}
      <div className="product-image-container">
        <Card.Img
          variant="top"
          src={productImage}
          className="product-image"
          alt={productTitle}
        />
      </div>

      {/* Body của card: tên, mô tả, giá */}
      <Card.Body className="product-content">
        <Card.Title className="product-title">{productTitle}</Card.Title>
        <Card.Text className="product-brand">{productDescription}</Card.Text>
        <div className="price-section">
          <div className="fw-bold">${productPrice}</div>
        </div>
      </Card.Body>

      {/* Footer của card: các nút action */}
      <Card.Footer className="bg-transparent border-0 p-3">
        <div className="d-grid gap-2">
          {/* Nút "View Details": Navigate đến trang chi tiết */}
          <Button
            as={Link}
            to={`/product/${productId}`}
            variant="primary"
            className="mb-2"
          >
            View Details
          </Button>

          {/* Container cho 2 nút: Add to Cart và Favorite */}
          <div className="d-flex gap-2">
            {/* Nút "Add to Cart" */}
            <Button
              variant="outline-primary"
              className="flex-fill"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            {/* Nút "Favorite": Đổi màu và text dựa vào trạng thái isFavorited */}
            <Button
              variant={isFavorited ? "danger" : "outline-danger"}  // Đỏ nếu đã yêu thích, outline nếu chưa
              className="flex-fill"
              onClick={handleFavorite}
            >
              <FaHeart /> {isFavorited ? "Favorited" : "Favorite"}
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
