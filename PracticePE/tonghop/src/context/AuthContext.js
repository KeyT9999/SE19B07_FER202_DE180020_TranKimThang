/**
 * AuthContext.js - Context quản lý Xác thực người dùng (Authentication)
 * 
 * MỤC ĐÍCH:
 * - Quản lý state về người dùng đang đăng nhập (user, isAuthenticated)
 * - Cung cấp các hàm: login(), register(), logout(), updateUser()
 * - Lưu trữ thông tin user vào sessionStorage để giữ đăng nhập khi refresh trang
 * - Quản lý redirect path để quay lại trang trước đó sau khi login
 * 
 * LUỒNG LOGIN (CHI TIẾT):
 * 
 * 1. User nhập email/username và password vào LoginForm
 *    → File: src/components/auth/LoginForm.jsx
 * 
 * 2. User click nút "Login"
 *    → LoginForm gọi hàm login(emailOrUsername, password) từ AuthContext
 * 
 * 3. AuthContext.login() thực hiện:
 *    a. Fetch danh sách accounts từ API (http://localhost:3001/accounts)
 *    b. Tìm user trong danh sách accounts khớp với email/username và password
 *    c. Kiểm tra:
 *       - Nếu không tìm thấy → return { success: false, message: "Invalid..." }
 *       - Nếu tài khoản bị deactivate → return { success: false, message: "Account deactivated" }
 *       - Nếu hợp lệ → tiếp tục
 *    d. Tạo userData object từ thông tin tìm được
 *    e. Lưu userData vào:
 *       - State: setUser(userData) → cập nhật state trong React
 *       - sessionStorage: sessionStorage.setItem("user", JSON.stringify(userData)) → lưu để giữ đăng nhập
 *    f. Navigate về redirectPath (trang trước đó) hoặc "/" nếu chưa có
 *    g. Hiển thị toast "Login successful!"
 *    h. Return { success: true }
 * 
 * 4. LoginForm nhận kết quả:
 *    - Nếu success: true → Form tự động đóng/redirect (do navigate trong AuthContext)
 *    - Nếu success: false → Hiển thị error message từ result.message
 * 
 * 5. Các component khác sử dụng:
 *    - Header.jsx: Sử dụng isAuthenticated và user để hiển thị thông tin user
 *    - Protected routes: Có thể sử dụng isAuthenticated để bảo vệ routes
 * 
 * LUỒNG REGISTER:
 * 1. User nhập thông tin vào RegisterForm
 * 2. RegisterForm gọi register(data) từ AuthContext
 * 3. AuthContext.register() thực hiện:
 *    - Fetch danh sách accounts để kiểm tra email/username đã tồn tại chưa
 *    - Nếu đã tồn tại → return error
 *    - Nếu chưa → POST account mới lên API
 *    - Navigate về /login
 * 
 * LUỒNG LOGOUT:
 * 1. User click nút logout (trong Header)
 * 2. Header gọi logout() từ AuthContext
 * 3. AuthContext.logout() thực hiện:
 *    - setUser(null) → xóa user khỏi state
 *    - sessionStorage.removeItem("user") → xóa user khỏi sessionStorage
 *    - navigate("/login") → chuyển về trang login
 * 
 * CÁC FILE ẢNH HƯỞNG ĐẾN LUỒNG LOGIN:
 * - src/context/AuthContext.js (file này): Xử lý logic login, lưu user, navigate
 * - src/components/auth/LoginForm.jsx: Form nhận input, gọi login(), hiển thị error
 * - src/pages/LoginPage.jsx: Trang chứa LoginForm
 * - src/layouts/AuthLayout.jsx: Layout cho trang login/register
 * - src/layouts/Header.jsx: Hiển thị thông tin user, nút logout
 * - src/routes/AppRoutes.js: Định nghĩa route /login
 * - src/context/ToastContext.js: Hiển thị thông báo login success/error
 * - src/config.js: Cấu hình API URL và field mapping
 * - db.json: Database chứa accounts (chạy với json-server)
 * 
 * STATE ĐƯỢC QUẢN LÝ:
 * - user: Object chứa thông tin user { id, name, email, avatar } hoặc null
 * - redirectPath: Đường dẫn để quay lại sau khi login (mặc định "/")
 * - isAuthenticated: Boolean (!!user) - true nếu đã đăng nhập
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - index.js: Wrap toàn bộ app với <AuthProvider>
 * - LoginForm.jsx: Sử dụng login() để đăng nhập
 * - RegisterForm.jsx: Sử dụng register() để đăng ký
 * - Header.jsx: Sử dụng user, isAuthenticated, logout() để hiển thị và xử lý logout
 * - Các component khác: Có thể sử dụng isAuthenticated để kiểm tra đăng nhập
 */

// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../config";
import { useToast } from "./ToastContext";

// Tạo Context để share authentication state giữa các components
export const AuthContext = createContext();

// URL API để fetch accounts từ json-server
// Ví dụ: http://localhost:3001/accounts
const ACCOUNTS_API_URL = `${config.dbUrl}/${config.collections.accounts}`;

/**
 * AuthProvider - Provider component cung cấp AuthContext cho toàn bộ app
 * 
 * @param {ReactNode} children - Các component con được wrap bởi AuthProvider
 */
export const AuthProvider = ({ children }) => {
  // State quản lý thông tin user đang đăng nhập
  // null = chưa đăng nhập, object = đã đăng nhập với thông tin user
  const [user, setUser] = useState(null);
  
  // State lưu đường dẫn để quay lại sau khi login
  // Ví dụ: user vào /products, chưa login, redirect về /login
  // Sau khi login xong sẽ quay lại /products
  const [redirectPath, setRedirectPath] = useState("/");
  
  // Hook từ react-router-dom để lấy thông tin route hiện tại
  const location = useLocation();
  
  // Hook từ react-router-dom để navigate (chuyển trang)
  const navigate = useNavigate();
  
  // Hook từ ToastContext để hiển thị thông báo
  const { showToast } = useToast();

  /**
   * useEffect: Khôi phục user từ sessionStorage khi app khởi động
   * 
   * Logic:
   * - Khi component mount (app khởi động), kiểm tra sessionStorage có user không
   * - Nếu có → parse JSON và set vào state
   * - Điều này giúp giữ đăng nhập khi user refresh trang
   * 
   * Dependency: [] (chỉ chạy 1 lần khi mount)
   */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * useEffect: Lưu redirect path khi user vào các trang (trừ login/register)
   * 
   * Logic:
   * - Khi user vào một trang (ví dụ /products)
   * - Nếu không phải trang login/register và khác với redirectPath hiện tại
   * - → Lưu đường dẫn đó vào redirectPath
   * - Sau khi login, sẽ quay lại trang này
   * 
   * Dependency: [location.pathname, redirectPath] (chạy khi pathname thay đổi)
   */
  useEffect(() => {
    if (
      !["/login", "/register"].includes(location.pathname) &&
      location.pathname !== redirectPath
    ) {
      setRedirectPath(location.pathname);
    }
  }, [location.pathname, redirectPath]);

  /**
   * login - Hàm đăng nhập người dùng
   * 
   * LUỒNG CHI TIẾT:
   * 1. Fetch danh sách accounts từ API (GET http://localhost:3001/accounts)
   * 2. Tìm user trong danh sách khớp với email/username và password
   * 3. Kiểm tra:
   *    - Không tìm thấy → return error "Invalid username/email or password"
   *    - Tài khoản bị deactivate → return error "Account deactivated"
   *    - Hợp lệ → tiếp tục
   * 4. Tạo userData object từ thông tin user
   * 5. Lưu userData vào state và sessionStorage
   * 6. Navigate về redirectPath (trang trước đó)
   * 7. Hiển thị toast "Login successful!"
   * 8. Return { success: true }
   * 
   * @param {string} emailOrUsername - Email hoặc username người dùng nhập
   * @param {string} password - Password người dùng nhập
   * @returns {Promise<Object>} { success: boolean, message?: string }
   * 
   * Cách sử dụng:
   * ```jsx
   * const { login } = useAuth();
   * const result = await login(email, password);
   * if (result.success) {
   *   // Login thành công
   * } else {
   *   // Hiển thị error: result.message
   * }
   * ```
   */
  const login = useCallback(
    async (emailOrUsername, password) => {
      try {
        // Bước 1: Fetch danh sách accounts từ API
        const response = await fetch(ACCOUNTS_API_URL);

        // Kiểm tra response có thành công không
        if (!response.ok) {
          return {
            success: false,
            message: `Error fetching accounts: ${response.status} ${response.statusText}`,
          };
        }

        // Parse JSON response thành array accounts
        const accounts = await response.json();
        
        // Bước 2: Tìm user trong danh sách accounts
        // So sánh: email hoặc username khớp VÀ password khớp
        const foundUser = accounts.find(
          (u) =>
            (config.getField("userEmail", u) === emailOrUsername ||
              config.getField("userName", u) === emailOrUsername) &&
            config.getField("userPassword", u) === password
        );

        // Bước 3: Kiểm tra kết quả tìm kiếm
        // Không tìm thấy user
        if (!foundUser) {
          return {
            success: false,
            message: "Invalid username/email or password.",
          };
        }

        // Tài khoản bị deactivate
        if (config.getField("userIsActive", foundUser) === false) {
          return {
            success: false,
            message: "This account has been deactivated.",
          };
        }

        // Bước 4: Tạo userData object từ thông tin user tìm được
        // Chỉ lấy các thông tin cần thiết (không lưu password)
        const userData = {
          id: config.getField("userId", foundUser),
          name:
            config.getField("userFullName", foundUser) ||
            config.getField("userName", foundUser),
          email: config.getField("userEmail", foundUser),
          avatar: config.getField("userAvatar", foundUser),
        };
        
        // Bước 5: Lưu userData vào state và sessionStorage
        setUser(userData);  // Cập nhật state trong React
        sessionStorage.setItem("user", JSON.stringify(userData));  // Lưu vào sessionStorage để giữ đăng nhập
        
        // Bước 6: Navigate về trang trước đó (redirectPath) hoặc "/"
        navigate(redirectPath, { replace: true });
        
        // Bước 7: Hiển thị thông báo thành công
        showToast("Login successful!", "success");
        
        // Bước 8: Return success
        return { success: true };
      } catch (error) {
        // Xử lý lỗi
        // Lỗi kết nối (không thể fetch API)
        if (error instanceof TypeError) {
          return {
            success: false,
            message: "Cannot connect to the authentication server.",
          };
        }
        // Lỗi khác
        console.error("Login error:", error);
        return {
          success: false,
          message: "An unexpected error occurred during login.",
        };
      }
    },
    [navigate, redirectPath, showToast]  // Dependencies: các giá trị này thay đổi sẽ tạo lại function
  );

  const register = useCallback(
    async (data) => {
      try {
        const response = await fetch(ACCOUNTS_API_URL);

        // MODIFICATION START: Translated error messages to English
        if (!response.ok) {
          return {
            success: false,
            message: `Error fetching accounts: ${response.status} ${response.statusText}`,
          };
        }
        // MODIFICATION END

        const accounts = await response.json();

        // MODIFICATION START: Translated error messages to English
        const emailExists = accounts.some(
          (u) => config.getField("userEmail", u) === data.email
        );
        if (emailExists) {
          return { success: false, message: "Email already exists." };
        }

        const usernameExists = accounts.some(
          (u) => config.getField("userName", u) === data.username
        );
        if (usernameExists) {
          return { success: false, message: "Username already exists." };
        }
        // MODIFICATION END

        const newUserPayload = {
          [config.fields.userFullName]: data.fullName,
          [config.fields.userEmail]: data.email,
          [config.fields.userName]: data.username,
          [config.fields.userPassword]: data.password,
          secretQuestion: data.secretQuestion,
          secretAnswer: data.secretAnswer,
          [config.fields.userAvatar]: data.avatar,
          wishlist: [],
          cart: [],
        };

        const registerResponse = await fetch(ACCOUNTS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserPayload),
        });

        if (!registerResponse.ok) throw new Error("Registration failed.");

        navigate("/login");
        return { success: true };
      } catch (error) {
        // MODIFICATION START: Translated error messages to English
        if (error instanceof TypeError) {
          return {
            success: false,
            message: "Cannot connect to the authentication server.",
          };
        }
        console.error("Registration error:", error);
        return {
          success: false,
          message: "An error occurred during registration.",
        };
        // MODIFICATION END
      }
    },
    [navigate]
  );

  const updateUser = useCallback(
    async (userId, data) => {
      try {
        const updatePayload = {
          [config.fields.userFullName]: data.fullName,
          [config.fields.userAvatar]: data.avatar,
        };

        const response = await fetch(`${ACCOUNTS_API_URL}/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) throw new Error("Update failed.");

        const updatedUser = await response.json();

        const updatedUserData = {
          ...user,
          name: config.getField("userFullName", updatedUser),
          avatar: config.getField("userAvatar", updatedUser),
        };
        setUser(updatedUserData);
        sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        return true;
      } catch (error) {
        console.error("Update error:", error);
        return false;
      }
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    setRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
