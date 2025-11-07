/**
 * FavoriteContext.js - Context quản lý Danh sách Yêu thích (Favorites)
 * 
 * MỤC ĐÍCH:
 * - Quản lý state toàn cục về danh sách sản phẩm yêu thích
 * - Cung cấp các hàm: addToFavorite(), removeFromFavorite(), clearFavorites(), isFavorite()
 * - Sử dụng useReducer để quản lý state
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Khi user click "Favorite" ở ProductCard hoặc ProductDetailPage:
 *    - Component kiểm tra isFavorite(productId) để xem đã yêu thích chưa
 *    - Nếu chưa yêu thích: gọi addToFavorite(product) → thêm vào items
 *    - Nếu đã yêu thích: gọi removeFromFavorite(id) → xóa khỏi items
 * 2. Component có thể sử dụng isFavorite(id) để hiển thị trạng thái (nút màu đỏ khi đã yêu thích)
 * 
 * STATE ĐƯỢC QUẢN LÝ:
 * - items: Array chứa các sản phẩm yêu thích
 *   Mỗi item có dạng: { id, name, price, image, description, ... }
 *   (Khác với Cart, Favorite không có quantity)
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - index.js: Wrap toàn bộ app với <FavoriteProvider>
 * - ProductCard.jsx: Sử dụng useFavorite() để thêm/xóa favorite
 * - ProductDetailPage.jsx: Sử dụng useFavorite() để thêm/xóa favorite
 * - FavoritePage.jsx: Sử dụng useFavorite() để hiển thị danh sách và xóa
 * - Header.jsx: Sử dụng useFavorite() để lấy items.length hiển thị badge số lượng
 * 
 * ACTIONS TRONG favoriteReducer:
 * - ADD_TO_FAVORITE: Thêm item vào danh sách yêu thích (kiểm tra trùng, nếu đã có thì không thêm)
 * - REMOVE_FROM_FAVORITE: Xóa một item khỏi danh sách yêu thích
 * - CLEAR_FAVORITES: Xóa toàn bộ danh sách yêu thích
 */

import React, { createContext, useContext, useReducer } from "react";

// Tạo Context để share state giữa các components
const FavoriteContext = createContext();

/**
 * favoriteReducer - Reducer function xử lý các action liên quan đến yêu thích
 * 
 * @param {Object} state - State hiện tại { items: [...] }
 * @param {Object} action - Action object { type: string, payload: any }
 * @returns {Object} State mới sau khi xử lý action
 */
const favoriteReducer = (state, action) => {
  switch (action.type) {
    /**
     * ADD_TO_FAVORITE: Thêm item vào danh sách yêu thích
     * 
     * Logic:
     * - Kiểm tra xem item đã có trong danh sách chưa (so sánh theo id)
     * - Nếu đã có → không làm gì, return state hiện tại (tránh trùng lặp)
     * - Nếu chưa có → thêm mới vào danh sách
     */
    case "ADD_TO_FAVORITE":
      // Tìm xem item đã có trong danh sách chưa
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      // Nếu đã có → không thêm nữa (tránh trùng lặp)
      if (existingItem) {
        return state;
      }
      
      // Nếu chưa có → thêm mới
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    
    /**
     * REMOVE_FROM_FAVORITE: Xóa một item khỏi danh sách yêu thích
     * 
     * Logic:
     * - Lọc ra tất cả items có id khác với action.payload.id
     * - Item có id khớp sẽ bị loại bỏ
     */
    case "REMOVE_FROM_FAVORITE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    
    /**
     * CLEAR_FAVORITES: Xóa toàn bộ danh sách yêu thích
     * 
     * Logic:
     * - Reset items về array rỗng
     */
    case "CLEAR_FAVORITES":
      return {
        ...state,
        items: [],
      };
    
    default:
      return state;
  }
};

// State khởi tạo của danh sách yêu thích
const initialState = {
  items: [],  // Danh sách sản phẩm yêu thích
};

/**
 * FavoriteProvider - Provider component cung cấp FavoriteContext cho toàn bộ app
 * 
 * @param {ReactNode} children - Các component con được wrap bởi FavoriteProvider
 */
export function FavoriteProvider({ children }) {
  // useReducer: Quản lý state với reducer pattern
  const [state, dispatch] = useReducer(favoriteReducer, initialState);

  /**
   * addToFavorite - Thêm sản phẩm vào danh sách yêu thích
   * 
   * @param {Object} product - Object sản phẩm cần thêm { id, name, price, image, description }
   * 
   * Logic:
   * - Gửi action ADD_TO_FAVORITE kèm product data
   * - Reducer sẽ kiểm tra và thêm nếu chưa có
   */
  const addToFavorite = (product) => {
    dispatch({ type: "ADD_TO_FAVORITE", payload: product });
  };

  /**
   * removeFromFavorite - Xóa sản phẩm khỏi danh sách yêu thích
   * 
   * @param {string|number} id - ID của sản phẩm cần xóa
   * 
   * Logic:
   * - Gửi action REMOVE_FROM_FAVORITE kèm id
   * - Reducer sẽ lọc bỏ item có id khớp
   */
  const removeFromFavorite = (id) => {
    dispatch({ type: "REMOVE_FROM_FAVORITE", payload: { id } });
  };

  /**
   * clearFavorites - Xóa toàn bộ danh sách yêu thích
   * 
   * Logic:
   * - Gửi action CLEAR_FAVORITES
   * - Reducer sẽ reset items về array rỗng
   */
  const clearFavorites = () => {
    dispatch({ type: "CLEAR_FAVORITES" });
  };

  /**
   * isFavorite - Kiểm tra xem sản phẩm đã được yêu thích chưa
   * 
   * @param {string|number} id - ID của sản phẩm cần kiểm tra
   * @returns {boolean} true nếu đã yêu thích, false nếu chưa
   * 
   * Logic:
   * - Tìm trong items xem có item nào có id khớp không
   * - some() trả về true nếu tìm thấy, false nếu không
   */
  const isFavorite = (id) => {
    return state.items.some((item) => item.id === id);
  };

  // Value object chứa state và functions để expose cho các component
  const value = {
    items: state.items,           // Danh sách sản phẩm yêu thích
    addToFavorite,                // Hàm thêm vào yêu thích
    removeFromFavorite,           // Hàm xóa khỏi yêu thích
    clearFavorites,               // Hàm xóa toàn bộ
    isFavorite,                   // Hàm kiểm tra đã yêu thích chưa
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

/**
 * useFavorite - Custom hook để sử dụng FavoriteContext
 * 
 * @returns {Object} { items, addToFavorite, removeFromFavorite, clearFavorites, isFavorite }
 * 
 * Cách sử dụng:
 * ```jsx
 * const { items, addToFavorite, isFavorite } = useFavorite();
 * ```
 * 
 * Lưu ý:
 * - Phải được sử dụng bên trong FavoriteProvider
 */
export function useFavorite() {
  const context = useContext(FavoriteContext);
  
  // Kiểm tra xem component có được wrap bởi FavoriteProvider không
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  
  return context;
}
