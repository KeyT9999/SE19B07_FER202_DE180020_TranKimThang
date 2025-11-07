/**
 * ProductContext.js - Context quản lý Danh sách Sản phẩm (Products)
 * 
 * MỤC ĐÍCH:
 * - Fetch danh sách sản phẩm từ API khi app khởi động
 * - Cung cấp danh sách sản phẩm cho toàn bộ app
 * - Quản lý state: products (danh sách), loading (đang tải), error (lỗi)
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Khi ProductProvider mount (app khởi động):
 *    → useEffect chạy → fetchProducts() được gọi
 * 2. fetchProducts() thực hiện:
 *    a. Fetch GET http://localhost:3001/products
 *    b. Parse JSON response
 *    c. setProducts(rawData) → Lưu danh sách sản phẩm
 *    d. setLoading(false) → Đánh dấu đã tải xong
 * 3. Nếu có lỗi:
 *    → setError(errorMessage) → Lưu thông báo lỗi
 *    → setLoading(false)
 * 4. Các component sử dụng:
 *    → const { products, loading, error } = useProducts()
 *    → Hiển thị loading spinner khi loading = true
 *    → Hiển thị error message khi error != null
 *    → Hiển thị danh sách sản phẩm khi có data
 * 
 * STATE ĐƯỢC QUẢN LÝ:
 * - products: Array chứa danh sách sản phẩm từ API
 * - loading: Boolean - true khi đang fetch data, false khi đã xong
 * - error: String hoặc null - Thông báo lỗi nếu có
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - index.js: Wrap toàn bộ app với <ProductProvider>
 * - HomePage.jsx: Sử dụng products để hiển thị Hero (carousel)
 * - ProductsPage.jsx: Sử dụng products để hiển thị danh sách
 * - ProductList.jsx: Nhận products prop từ ProductsPage
 * - ProductDetailPage.jsx: Sử dụng products để tìm sản phẩm theo id
 * 
 * LƯU Ý:
 * - Chỉ fetch 1 lần khi component mount (dependency: [])
 * - Nếu cần refresh data, phải unmount và mount lại ProductProvider
 * - Data được fetch từ json-server (http://localhost:3001/products)
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import config from "../config";

// Tạo Context để share products state giữa các components
export const ProductContext = createContext();

/**
 * useProducts - Custom hook để sử dụng ProductContext
 * 
 * @returns {Object} { products, loading, error }
 * 
 * Cách sử dụng:
 * ```jsx
 * const { products, loading, error } = useProducts();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Alert>{error}</Alert>;
 * return <ProductList products={products} />;
 * ```
 */
export const useProducts = () => useContext(ProductContext);

/**
 * ProductProvider - Provider component cung cấp ProductContext cho toàn bộ app
 * 
 * @param {ReactNode} children - Các component con được wrap bởi ProductProvider
 */
export const ProductProvider = ({ children }) => {
  // State chứa danh sách sản phẩm
  const [products, setProducts] = useState([]);
  
  // State đánh dấu đang tải data (true khi fetch, false khi xong)
  const [loading, setLoading] = useState(true);
  
  // State chứa thông báo lỗi (null nếu không có lỗi)
  const [error, setError] = useState(null);

  /**
   * useEffect: Fetch danh sách sản phẩm từ API khi component mount
   * 
   * Logic:
   * - Khi ProductProvider mount (app khởi động)
   * - Gọi fetchProducts() để lấy data từ API
   * - Lưu vào state products
   * - Set loading = false khi xong
   * 
   * Dependency: [] (chỉ chạy 1 lần khi mount)
   */
  useEffect(() => {
    /**
     * fetchProducts - Hàm async fetch danh sách sản phẩm từ API
     * 
     * Các bước:
     * 1. Fetch GET request đến API (http://localhost:3001/products)
     * 2. Kiểm tra response.ok
     * 3. Parse JSON response
     * 4. setProducts(rawData) → Lưu vào state
     * 5. Xử lý lỗi nếu có
     */
    const fetchProducts = async () => {
      try {
        // Bước 1: Fetch data từ API
        const response = await fetch(
          `${config.dbUrl}/${config.collections.products}`
        );

        // Bước 2: Kiểm tra response có thành công không
        if (!response.ok) {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }

        // Bước 3: Parse JSON response thành array products
        const rawData = await response.json();
        
        // Bước 4: Lưu vào state
        setProducts(rawData);
      } catch (err) {
        // Xử lý lỗi
        // Lỗi kết nối (không thể fetch API - TypeError)
        if (err instanceof TypeError) {
          setError(
            "Cannot connect to the server. Please check your network connection or make sure the server is running."
          );
        } else {
          // Lỗi khác (ví dụ: 404, 500, etc.)
          setError(err.message);
        }
      } finally {
        // Luôn set loading = false dù thành công hay thất bại
        setLoading(false);
      }
    };

    // Gọi hàm fetch khi component mount
    fetchProducts();
  }, []);  // Dependency rỗng → chỉ chạy 1 lần khi mount

  const value = { products, loading, error };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
