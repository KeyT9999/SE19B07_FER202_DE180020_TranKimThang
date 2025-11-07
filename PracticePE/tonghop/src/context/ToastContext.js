/**
 * ToastContext.js - Context quản lý Thông báo (Toast Notifications)
 * 
 * MỤC ĐÍCH:
 * - Quản lý danh sách các thông báo (toast notifications)
 * - Cung cấp hàm showToast() để hiển thị thông báo
 * - Cung cấp hàm removeToast() để xóa thông báo
 * - Sử dụng cùng với ToastNotifications component để hiển thị UI
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Component gọi showToast(message, type):
 *    → Tạo toast object với id, message, type
 *    → Thêm vào array toasts
 * 2. ToastNotifications component (được render trong AuthLayout):
 *    → Đọc toasts từ context
 *    → Hiển thị từng toast với animation
 *    → Tự động gọi removeToast() sau vài giây
 * 3. User click nút đóng trên toast:
 *    → removeToast(id) được gọi
 *    → Xóa toast khỏi array toasts
 * 
 * STATE ĐƯỢC QUẢN LÝ:
 * - toasts: Array chứa các toast notifications
 *   Mỗi toast có dạng: { id: number, message: string, type: string }
 *   type: "success" | "error" | "warning" | "info"
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - index.js: Wrap toàn bộ app với <ToastProvider>
 * - AuthContext.js: showToast("Login successful!", "success")
 * - ProductCard.jsx: showToast khi thêm vào cart/favorite
 * - ProductDetailPage.jsx: showToast khi thêm vào cart/favorite
 * - ToastNotifications.jsx: Hiển thị danh sách toasts
 * 
 * CÁC LOẠI TOAST:
 * - "success": Thông báo thành công (màu xanh lá)
 * - "error": Thông báo lỗi (màu đỏ)
 * - "warning": Cảnh báo (màu vàng)
 * - "info": Thông tin (màu xanh dương)
 */

import React, { createContext, useState, useCallback, useContext } from "react";

// Tạo Context để share toast state giữa các components
const ToastContext = createContext(null);

/**
 * useToast - Custom hook để sử dụng ToastContext
 * 
 * @returns {Object} { toasts, showToast, removeToast }
 */
export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider - Provider component cung cấp ToastContext cho toàn bộ app
 * 
 * @param {ReactNode} children - Các component con được wrap bởi ToastProvider
 */
export const ToastProvider = ({ children }) => {
  // State chứa danh sách các toast notifications
  // Mỗi toast: { id: number, message: string, type: string }
  const [toasts, setToasts] = useState([]);

  /**
   * showToast - Hiển thị một toast notification
   * 
   * @param {string} message - Nội dung thông báo
   * @param {string} type - Loại toast: "success" | "error" | "warning" | "info" (mặc định: "success")
   * 
   * Logic:
   * - Tạo id unique bằng Date.now()
   * - Tạo toast object: { id, message, type }
   * - Thêm vào array toasts (giữ lại các toast cũ)
   * 
   * Cách sử dụng:
   * ```jsx
   * const { showToast } = useToast();
   * showToast("Đăng nhập thành công!", "success");
   * showToast("Có lỗi xảy ra!", "error");
   * ```
   */
  const showToast = useCallback((message, type = "success") => {
    // Tạo id unique cho toast (timestamp)
    const id = Date.now();
    
    // Thêm toast mới vào danh sách (giữ lại các toast cũ)
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);  // Không có dependency → function không thay đổi

  /**
   * removeToast - Xóa một toast notification khỏi danh sách
   * 
   * @param {number} id - ID của toast cần xóa
   * 
   * Logic:
   * - Lọc bỏ toast có id khớp khỏi array toasts
   * - Giữ lại các toast khác
   * 
   * Được gọi bởi:
   * - ToastNotifications component khi user click nút đóng
   * - ToastNotifications component khi toast tự động timeout
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Value object chứa state và functions để expose cho các component
  const value = { 
    toasts,        // Danh sách toasts
    showToast,     // Hàm hiển thị toast
    removeToast,   // Hàm xóa toast
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
