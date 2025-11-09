/**
 * AuthContext.jsx - Context quản lý Authentication (Đăng nhập/Đăng xuất)
 * 
 * Mục đích:
 * - Quản lý state toàn cục về authentication (user đã đăng nhập, trạng thái đăng nhập)
 * - Cung cấp functions: login(), logout(), clearError()
 * - Fetch danh sách users từ JSON Server khi component mount
 * - Xác thực người dùng khi đăng nhập
 * 
 * Luồng hoạt động:
 * 1. Khi AuthProvider mount → useEffect gọi fetchUser() để lấy danh sách users từ JSON Server
 * 2. Lưu danh sách users vào state
 * 3. Khi LoginForm gọi login(identifier, password):
 *    - Tìm user khớp với identifier (username hoặc email) và password
 *    - Kiểm tra status (không được "locked")
 *    - Nếu hợp lệ → dispatch LOGIN_SUCCESS → cập nhật currentUser, isAuthenticated = true
 *    - Nếu không hợp lệ → dispatch LOGIN_FAILURE → cập nhật error
 * 
 * State được quản lý:
 * - users: Danh sách users từ JSON Server
 * - currentUser: User hiện tại đã đăng nhập (null nếu chưa đăng nhập)
 * - isAuthenticated: true nếu đã đăng nhập, false nếu chưa
 * - loading: true khi đang fetch users hoặc đang đăng nhập
 * - error: Lỗi nếu có (ví dụ: "Invalid credentials.")
 * 
 * Được sử dụng ở:
 * - App.js: Wrap toàn bộ app với <AuthProvider>
 * - LoginForm.jsx: Sử dụng useAuth() để lấy login(), error, loading, user
 * - Có thể được dùng ở bất kỳ component nào để check authentication status
 * 
 * API Endpoints sử dụng:
 * - GET /users - Lấy danh sách users từ JSON Server
 */

import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useEffect,
} from "react";

import { authReducer, initialState } from "../reducers/AuthReducer";  // Reducer xử lý các action
import MotorbikeAPI from "../api/API";                                // Axios instance để gọi API

// Tạo Context để share state giữa các components
// createContext() tạo một context object mới
export const AuthContext = createContext();

/**
 * AuthProvider - Component Provider cho AuthContext
 * 
 * Wrap toàn bộ app với AuthProvider để tất cả components có thể truy cập auth state
 * Sử dụng useReducer để quản lý state (users, currentUser, isAuthenticated, loading, error)
 * 
 * @param {Object} children - Components con bên trong AuthProvider
 */
export function AuthProvider({ children }) {
  // useReducer: Quản lý state phức tạp với các action
  // authReducer: Function xử lý các action (LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE, etc.)
  // initialState: State ban đầu { user: null, users: [], loading: false, error: null, isAuthenticated: false }
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * fetchUser: Fetch danh sách users từ JSON Server
   * 
   * Được gọi khi component mount (trong useEffect)
   * Lưu danh sách users vào state để sử dụng cho việc xác thực đăng nhập
   */
  const fetchUser = useCallback(async () => {
    // Dispatch action START_LOADING → set loading = true
    dispatch({ type: "START_LOADING" });
    
    try {
      // Gọi API GET /users từ JSON Server
      // Response sẽ có dạng: [{ id: 1, username: "tai", password: "123456", ... }, ...]
      const response = await MotorbikeAPI.get("/users");
      
      // Dispatch action SET_USERS → lưu danh sách users vào state, set loading = false
      dispatch({ type: "SET_USERS", payload: response.data });
    } catch (error) {
      console.error("Lỗi khi tải danh sách users:", error);
      // Nếu có lỗi → set users = [] (empty array)
      dispatch({ type: "SET_USERS", payload: [] });
    }
  }, [dispatch]);

  // useEffect: Chạy khi component mount (lần đầu render)
  // Gọi fetchUser() để lấy danh sách users từ JSON Server
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * login: Function xác thực đăng nhập
   * 
   * @param {string} identifier - Username hoặc email
   * @param {string} password - Password
   * @returns {Promise<Object>} { ok: boolean, account?: Object } - Kết quả đăng nhập
   * 
   * Luồng hoạt động:
   * 1. Dispatch LOGIN_START → set loading = true, error = null
   * 2. Tìm user trong state.users khớp với identifier và password
   * 3. Kiểm tra status (không được "locked")
   * 4. Nếu hợp lệ → dispatch LOGIN_SUCCESS → cập nhật currentUser, isAuthenticated = true
   * 5. Nếu không hợp lệ → dispatch LOGIN_FAILURE → cập nhật error
   */
  function login(identifier, password) {
    // Dispatch action LOGIN_START → set loading = true, error = null
    dispatch({ type: "LOGIN_START" });
    
    // Return Promise để có thể sử dụng async/await ở component gọi
    return new Promise((resolve) => {
      // setTimeout để mô phỏng delay của API call (1 giây)
      setTimeout(() => {
        // Kiểm tra xem identifier có phải email không (có chứa "@")
        const isEmail = identifier.includes("@");
        
        // Tìm user trong danh sách users khớp với identifier và password
        const account = state.users.find((acc) =>
          isEmail
            ? acc.email === identifier && acc.password === password  // Nếu là email → so sánh email
            : acc.username === identifier && acc.password === password  // Nếu là username → so sánh username
        );
        
        // Nếu không tìm thấy user → login thất bại
        if (!account) {
          // Dispatch action LOGIN_FAILURE → set error = "Invalid credentials.", isAuthenticated = false
          dispatch({ type: "LOGIN_FAILURE", payload: "Invalid credentials." });
          resolve({ ok: false });
          return;
        }
        
        // Kiểm tra account có bị khóa không
        if (account.status === "locked") {
          // Dispatch action LOGIN_FAILURE → set error = "Account locked."
          dispatch({ type: "LOGIN_FAILURE", payload: "Account locked." });
          resolve({ ok: false });
          return;
        }
        
        // Nếu hợp lệ → login thành công
        // Dispatch action LOGIN_SUCCESS → set currentUser = account, isAuthenticated = true, loading = false
        dispatch({ type: "LOGIN_SUCCESS", payload: account });
        resolve({ ok: true, account });
      }, 1000);  // Delay 1 giây để mô phỏng API call
    });
  }

  /**
   * logout: Function đăng xuất
   * 
   * Dispatch action LOGOUT → set currentUser = null, isAuthenticated = false
   */
  function logout() {
    // Dispatch action LOGOUT → reset về trạng thái chưa đăng nhập
    dispatch({ type: "LOGOUT" });
  }

  /**
   * clearError: Function xóa error
   * 
   * Dispatch action CLEAR_ERROR → set error = null
   */
  function clearError() {
    // Dispatch action CLEAR_ERROR → xóa error khỏi state
    dispatch({ type: "CLEAR_ERROR" });
  }

  // Tạo context value chứa tất cả state và functions để share với components con
  const contextValue = {
    ...state,        // Spread tất cả state (users, currentUser, isAuthenticated, loading, error)
    login,           // Function đăng nhập
    logout,          // Function đăng xuất
    clearError,      // Function xóa error
  };

  // Provider cung cấp contextValue cho tất cả components con
  // Tất cả components bên trong <AuthProvider> có thể sử dụng useAuth() để truy cập contextValue
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * useAuth - Custom hook để sử dụng AuthContext
 * 
 * @returns {Object} Context value chứa state và functions
 * @throws {Error} Nếu được gọi bên ngoài AuthProvider
 * 
 * Sử dụng:
 * const { login, logout, error, loading, user, isAuthenticated } = useAuth();
 */
export function useAuth() {
  // useContext: Lấy context value từ AuthContext
  const context = useContext(AuthContext);
  
  // Nếu context không tồn tại (tức là component này không nằm trong AuthProvider)
  // → throw error để báo cho developer biết
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  
  return context;
}

export default AuthContext;