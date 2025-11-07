/**
 * CartContext.jsx - Context quản lý Giỏ hàng (Shopping Cart)
 * 
 * Mục đích:
 * - Quản lý state toàn cục về giỏ hàng (danh sách items, số lượng mỗi item)
 * - Cung cấp functions: addToCart(), updateQuantity(), removeFromCart(), clearCart(), getTotalPrice()
 * - Sử dụng useReducer để quản lý state phức tạp
 * 
 * Luồng hoạt động:
 * 1. Khi user click "Add to Cart" ở MotobikesList:
 *    - MotobikesList gọi addToCart(motorbike) từ CartContext
 *    - addToCart() dispatch action ADD_TO_CART → thêm motorbike vào items hoặc tăng quantity nếu đã có
 * 2. Khi user thay đổi quantity ở CartPage:
 *    - CartPage gọi updateQuantity(id, quantity)
 *    - updateQuantity() dispatch action UPDATE_QUANTITY → cập nhật quantity của item
 * 3. Khi user click "Remove" ở CartPage:
 *    - CartPage gọi removeFromCart(id)
 *    - removeFromCart() dispatch action REMOVE_FROM_CART → xóa item khỏi items
 * 
 * State được quản lý:
 * - items: Array chứa các item trong giỏ hàng
 *   Mỗi item có dạng: { id, name, brand, model, price, quantity, ... }
 *   quantity: Số lượng của item đó trong giỏ hàng
 * 
 * Được sử dụng ở:
 * - App.js: Wrap toàn bộ app với <CartProvider>
 * - MotobikesList.jsx: Sử dụng useCart() để lấy addToCart()
 * - CartPage.jsx: Sử dụng useCart() để lấy items, updateQuantity(), removeFromCart(), getTotalPrice()
 * 
 * Actions trong cartReducer:
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
     * - Nếu item đã có trong giỏ hàng (tìm theo id) → tăng quantity lên 1
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
     * - Tìm item theo id
     * - Cập nhật quantity của item đó bằng quantity mới từ payload
     */
    case "UPDATE_QUANTITY":
      return {
        ...state,
        // map() tạo array mới, tìm item có id khớp và cập nhật quantity
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }  // Cập nhật quantity mới
            : item  // Giữ nguyên các item khác
        ),
      };
    
    /**
     * REMOVE_FROM_CART: Xóa một item khỏi giỏ hàng
     * 
     * Logic:
     * - filter() tạo array mới chỉ chứa các item không có id khớp với id cần xóa
     */
    case "REMOVE_FROM_CART":
      return {
        ...state,
        // filter() loại bỏ item có id khớp với id cần xóa
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    
    /**
     * CLEAR_CART: Xóa toàn bộ giỏ hàng
     * 
     * Logic:
     * - Reset items về array rỗng []
     */
    case "CLEAR_CART":
      return {
        ...state,
        items: [],  // Xóa toàn bộ items
      };
    
    // Nếu action không khớp với bất kỳ case nào → trả về state hiện tại (không thay đổi)
    default:
      return state;
  }
};

/**
 * initialState - State ban đầu của giỏ hàng
 * 
 * items: Array rỗng - chưa có item nào trong giỏ hàng
 */
const initialState = {
  items: [],  // Danh sách items trong giỏ hàng (ban đầu là rỗng)
};

/**
 * CartProvider - Component Provider cho CartContext
 * 
 * Wrap toàn bộ app với CartProvider để tất cả components có thể truy cập cart state
 * Sử dụng useReducer để quản lý state (items)
 * 
 * @param {Object} children - Components con bên trong CartProvider
 * 
 * @returns {JSX.Element} CartContext.Provider với value chứa state và functions
 */
export function CartProvider({ children }) {
  // useReducer: Quản lý state phức tạp với các action
  // cartReducer: Function xử lý các action (ADD_TO_CART, UPDATE_QUANTITY, REMOVE_FROM_CART, CLEAR_CART)
  // initialState: State ban đầu { items: [] }
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * addToCart - Function thêm item vào giỏ hàng
   * 
   * @param {Object} motorbike - Object motorbike cần thêm vào giỏ hàng
   * 
   * Logic:
   * - Dispatch action ADD_TO_CART với payload là motorbike
   * - cartReducer sẽ xử lý: nếu đã có → tăng quantity, nếu chưa → thêm mới
   * 
   * Được gọi từ:
   * - MotobikesList.jsx: Khi user click "Add to Cart" button
   */
  const addToCart = (motorbike) => {
    // Dispatch action ADD_TO_CART → cartReducer sẽ xử lý thêm vào giỏ hàng
    dispatch({ type: "ADD_TO_CART", payload: motorbike });
  };

  /**
   * updateQuantity - Function cập nhật số lượng của một item
   * 
   * @param {string|number} id - ID của item cần cập nhật
   * @param {number} quantity - Số lượng mới
   * 
   * Logic:
   * - Dispatch action UPDATE_QUANTITY với payload { id, quantity }
   * - cartReducer sẽ cập nhật quantity của item có id tương ứng
   * 
   * Được gọi từ:
   * - CartPage.jsx: Khi user thay đổi quantity input hoặc click +/-
   */
  const updateQuantity = (id, quantity) => {
    // Dispatch action UPDATE_QUANTITY → cartReducer sẽ cập nhật quantity
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  /**
   * removeFromCart - Function xóa một item khỏi giỏ hàng
   * 
   * @param {string|number} id - ID của item cần xóa
   * 
   * Logic:
   * - Dispatch action REMOVE_FROM_CART với payload { id }
   * - cartReducer sẽ xóa item có id tương ứng khỏi items array
   * 
   * Được gọi từ:
   * - CartPage.jsx: Khi user click "Remove" button
   */
  const removeFromCart = (id) => {
    // Dispatch action REMOVE_FROM_CART → cartReducer sẽ xóa item
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  /**
   * clearCart - Function xóa toàn bộ giỏ hàng
   * 
   * Logic:
   * - Dispatch action CLEAR_CART
   * - cartReducer sẽ reset items về array rỗng []
   * 
   * Có thể được gọi từ:
   * - CartPage.jsx: Sau khi user checkout thành công
   * - Hoặc bất kỳ component nào cần xóa toàn bộ giỏ hàng
   */
  const clearCart = () => {
    // Dispatch action CLEAR_CART → cartReducer sẽ xóa toàn bộ items
    dispatch({ type: "CLEAR_CART" });
  };

  /**
   * getTotalPrice - Function tính tổng tiền của giỏ hàng
   * 
   * @returns {number} Tổng tiền (số, không có format VND)
   * 
   * Logic:
   * - Duyệt qua tất cả items trong giỏ hàng
   * - Với mỗi item: tính price * quantity
   * - Cộng tất cả lại để được tổng tiền
   * - Xử lý format price string (ví dụ: "72,000,000 VND" → 72000000)
   * 
   * Được gọi từ:
   * - CartPage.jsx: Hiển thị tổng tiền ở cuối bảng
   */
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = typeof item.price === 'number' 
        ? item.price 
        : parseFloat(String(item.price).replace(/[^\d]/g, "").replace(/\./g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  // Tạo context value chứa tất cả state và functions để share với components con
  const value = {
    items: state.items,           // Danh sách items trong giỏ hàng
    addToCart,                    // Function thêm vào giỏ hàng
    updateQuantity,               // Function cập nhật số lượng
    removeFromCart,               // Function xóa khỏi giỏ hàng
    clearCart,                    // Function xóa toàn bộ giỏ hàng
    getTotalPrice,                // Function tính tổng tiền
  };

  // Provider cung cấp value cho tất cả components con
  // Tất cả components bên trong <CartProvider> có thể sử dụng useCart() để truy cập value
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * useCart - Custom hook để sử dụng CartContext
 * 
 * @returns {Object} Context value chứa state và functions
 * @throws {Error} Nếu được gọi bên ngoài CartProvider
 * 
 * Sử dụng:
 * const { items, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
 */
export function useCart() {
  // useContext: Lấy context value từ CartContext
  const context = useContext(CartContext);
  
  // Nếu context không tồn tại (tức là component này không nằm trong CartProvider)
  // → throw error để báo cho developer biết
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
