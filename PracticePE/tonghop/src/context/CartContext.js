/**
 * CartContext.js - Context quản lý Giỏ hàng (Shopping Cart)
 * 
 * MỤC ĐÍCH:
 * - Quản lý state toàn cục về giỏ hàng (danh sách sản phẩm, số lượng mỗi sản phẩm)
 * - Cung cấp các hàm: addToCart(), updateQuantity(), removeFromCart(), clearCart(), getTotalPrice()
 * - Sử dụng useReducer để quản lý state phức tạp
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Khi user click "Add to Cart" ở ProductCard hoặc ProductDetailPage:
 *    - Component gọi addToCart(product) từ CartContext
 *    - addToCart() dispatch action ADD_TO_CART → thêm sản phẩm vào items hoặc tăng quantity nếu đã có
 * 2. Khi user thay đổi quantity ở CartPage:
 *    - CartPage gọi updateQuantity(id, quantity)
 *    - updateQuantity() dispatch action UPDATE_QUANTITY → cập nhật quantity của item
 * 3. Khi user click "Remove" ở CartPage:
 *    - CartPage gọi removeFromCart(id)
 *    - removeFromCart() dispatch action REMOVE_FROM_CART → xóa item khỏi items
 * 
 * STATE ĐƯỢC QUẢN LÝ:
 * - items: Array chứa các item trong giỏ hàng
 *   Mỗi item có dạng: { id, name, price, image, description, quantity, ... }
 *   quantity: Số lượng của item đó trong giỏ hàng
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - index.js: Wrap toàn bộ app với <CartProvider>
 * - ProductCard.jsx: Sử dụng useCart() để lấy addToCart()
 * - ProductDetailPage.jsx: Sử dụng useCart() để lấy addToCart()
 * - CartPage.jsx: Sử dụng useCart() để lấy items, updateQuantity(), removeFromCart(), getTotalPrice()
 * - Header.jsx: Sử dụng useCart() để lấy items.length hiển thị badge số lượng
 * 
 * ACTIONS TRONG cartReducer:
 * - ADD_TO_CART: Thêm item vào giỏ hàng (nếu đã có → tăng quantity, nếu chưa → thêm mới)
 * - UPDATE_QUANTITY: Cập nhật số lượng của một item
 * - REMOVE_FROM_CART: Xóa một item khỏi giỏ hàng
 * - CLEAR_CART: Xóa toàn bộ giỏ hàng
 */

import React, { createContext, useContext, useReducer } from "react";

// Tạo Context để share state giữa các components
// createContext() tạo một context object mới để quản lý cart state toàn cục
const CartContext = createContext();

/**
 * cartReducer - Reducer function xử lý các action liên quan đến giỏ hàng
 * 
 * @param {Object} state - State hiện tại của giỏ hàng { items: [...] }
 * @param {Object} action - Action object { type: string, payload: any }
 * @returns {Object} State mới sau khi xử lý action
 * 
 * Actions:
 * - ADD_TO_CART: Thêm item vào giỏ hàng
 * - UPDATE_QUANTITY: Cập nhật số lượng
 * - REMOVE_FROM_CART: Xóa item
 * - CLEAR_CART: Xóa toàn bộ
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    /**
     * ADD_TO_CART: Thêm item vào giỏ hàng
     * 
     * Logic:
     * - Tìm xem item đã có trong giỏ hàng chưa (so sánh theo id)
     * - Nếu item đã có trong giỏ hàng → tăng quantity lên 1
     * - Nếu item chưa có → thêm mới với quantity = 1
     */
    case "ADD_TO_CART":
      // Tìm xem item đã có trong giỏ hàng chưa (so sánh theo id)
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      // Nếu item đã có trong giỏ hàng
      if (existingItem) {
        // Tăng quantity của item đó lên 1
        // map() tạo array mới, tìm item có id khớp và tăng quantity
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }  // Tăng quantity
              : item  // Giữ nguyên các item khác
          ),
        };
      }
      
      // Nếu item chưa có → thêm mới vào giỏ hàng với quantity = 1
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],  // Spread operator để thêm item mới
      };
    
    /**
     * UPDATE_QUANTITY: Cập nhật số lượng của một item
     * 
     * Logic:
     * - Tìm item có id khớp với action.payload.id
     * - Cập nhật quantity của item đó thành action.payload.quantity
     */
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }  // Cập nhật quantity
            : item  // Giữ nguyên các item khác
        ),
      };
    
    /**
     * REMOVE_FROM_CART: Xóa một item khỏi giỏ hàng
     * 
     * Logic:
     * - Lọc ra tất cả items có id khác với action.payload.id
     * - Item có id khớp sẽ bị loại bỏ
     */
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),  // Lọc bỏ item có id khớp
      };
    
    /**
     * CLEAR_CART: Xóa toàn bộ giỏ hàng
     * 
     * Logic:
     * - Reset items về array rỗng
     */
    case "CLEAR_CART":
      return {
        ...state,
        items: [],  // Xóa toàn bộ items
      };
    
    default:
      return state;
  }
};

// State khởi tạo của giỏ hàng
const initialState = {
  items: [],  // Danh sách sản phẩm trong giỏ hàng
};

/**
 * CartProvider - Provider component cung cấp CartContext cho toàn bộ app
 * 
 * @param {ReactNode} children - Các component con được wrap bởi CartProvider
 * 
 * Chức năng:
 * - Sử dụng useReducer để quản lý state của giỏ hàng
 * - Cung cấp các hàm để thao tác với giỏ hàng (addToCart, updateQuantity, etc.)
 * - Expose state và functions thông qua Context.Provider
 */
export function CartProvider({ children }) {
  // useReducer: Quản lý state phức tạp với reducer pattern
  // state: State hiện tại { items: [...] }
  // dispatch: Hàm để gửi action đến reducer
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * addToCart - Thêm sản phẩm vào giỏ hàng
   * 
   * @param {Object} product - Object sản phẩm cần thêm { id, name, price, image, description }
   * 
   * Logic:
   * - Gửi action ADD_TO_CART kèm product data
   * - Reducer sẽ xử lý: nếu đã có thì tăng quantity, chưa có thì thêm mới
   */
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  /**
   * updateQuantity - Cập nhật số lượng của sản phẩm trong giỏ hàng
   * 
   * @param {string|number} id - ID của sản phẩm cần cập nhật
   * @param {number} quantity - Số lượng mới
   * 
   * Logic:
   * - Gửi action UPDATE_QUANTITY kèm id và quantity mới
   * - Reducer sẽ tìm item và cập nhật quantity
   */
  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  /**
   * removeFromCart - Xóa sản phẩm khỏi giỏ hàng
   * 
   * @param {string|number} id - ID của sản phẩm cần xóa
   * 
   * Logic:
   * - Gửi action REMOVE_FROM_CART kèm id
   * - Reducer sẽ lọc bỏ item có id khớp
   */
  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  /**
   * clearCart - Xóa toàn bộ giỏ hàng
   * 
   * Logic:
   * - Gửi action CLEAR_CART
   * - Reducer sẽ reset items về array rỗng
   */
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  /**
   * getTotalPrice - Tính tổng tiền của tất cả sản phẩm trong giỏ hàng
   * 
   * @returns {number} Tổng tiền (price * quantity cho mỗi item)
   * 
   * Logic:
   * - Duyệt qua tất cả items
   * - Tính tổng: sum += (item.price * item.quantity)
   */
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  // Value object chứa state và functions để expose cho các component
  const value = {
    items: state.items,           // Danh sách sản phẩm trong giỏ hàng
    addToCart,                    // Hàm thêm sản phẩm
    updateQuantity,               // Hàm cập nhật số lượng
    removeFromCart,               // Hàm xóa sản phẩm
    clearCart,                    // Hàm xóa toàn bộ
    getTotalPrice,                // Hàm tính tổng tiền
  };

  // Provider component wrap children và cung cấp value qua Context
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * useCart - Custom hook để sử dụng CartContext
 * 
 * @returns {Object} { items, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice }
 * 
 * Cách sử dụng:
 * ```jsx
 * const { items, addToCart } = useCart();
 * ```
 * 
 * Lưu ý:
 * - Phải được sử dụng bên trong CartProvider
 * - Nếu sử dụng ngoài CartProvider sẽ throw error
 */
export function useCart() {
  const context = useContext(CartContext);
  
  // Kiểm tra xem component có được wrap bởi CartProvider không
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}

