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
import api from "../services/api.js";                                    // Axios instance để gọi API

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
      console.log('[AuthContext] fetchUser: Fetching users from API...');
      // Gọi API GET /users từ JSON Server
      // Response sẽ có dạng: [{ id: 1, username: "tai", password: "123456", ... }, ...]
      const response = await api.get("/users");
      
      console.log('[AuthContext] fetchUser: API Response:', {
        status: response?.status,
        hasData: !!response?.data,
        dataType: typeof response?.data,
        isArray: Array.isArray(response?.data),
        dataLength: Array.isArray(response?.data) ? response.data.length : 'N/A'
      });
      
      // Dispatch action SET_USERS → lưu danh sách users vào state, set loading = false
      if (response && response.data && Array.isArray(response.data)) {
        dispatch({ type: "SET_USERS", payload: response.data });
        console.log('[AuthContext] fetchUser: Users loaded successfully:', response.data.length);
      } else {
        console.error('[AuthContext] fetchUser: Invalid response format:', response);
        dispatch({ type: "SET_USERS", payload: [] });
      }
    } catch (error) {
      console.error('[AuthContext] fetchUser: Error fetching users:', error);
      console.error('[AuthContext] fetchUser: Error details:', {
        message: error?.message,
        code: error?.code,
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText
        } : null,
        request: error?.request ? 'Request made but no response' : null
      });
      // Nếu có lỗi → set users = [] (empty array)
      dispatch({ type: "SET_USERS", payload: [] });
    }
  }, []);

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
   * 2. Kiểm tra xem users đã được load chưa, nếu chưa thì đợi
   * 3. Tìm user trong state.users khớp với identifier và password
   * 4. Kiểm tra status (không được "locked")
   * 5. Nếu hợp lệ → dispatch LOGIN_SUCCESS → cập nhật currentUser, isAuthenticated = true
   * 6. Nếu không hợp lệ → dispatch LOGIN_FAILURE → cập nhật error
   */
  const login = useCallback(async (identifier, password) => {
    // Lấy state mới nhất bằng cách sử dụng dispatch với functional update
    // Hoặc đọc trực tiếp từ state hiện tại
    // Dispatch action LOGIN_START → set loading = true, error = null
    dispatch({ type: "LOGIN_START" });
    
    try {
      // Validate inputs trước
      if (!identifier || !password) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Vui lòng nhập đầy đủ thông tin." });
        return { ok: false };
      }
      
      // Luôn fetch users từ API để đảm bảo có dữ liệu mới nhất
      let users = [];
      
      console.log('[AuthContext] Login attempt:', {
        identifier: identifier.trim()
      });
      
      // Fetch users từ API
      try {
        console.log('[AuthContext] Fetching users from API...');
        const response = await api.get("/users");
        console.log('[AuthContext] API Response:', {
          status: response?.status,
          hasData: !!response?.data,
          dataType: typeof response?.data,
          isArray: Array.isArray(response?.data)
        });
        
        if (response && response.data && Array.isArray(response.data)) {
          users = response.data;
          dispatch({ type: "SET_USERS", payload: users });
          console.log('[AuthContext] Users loaded from API:', users.length);
        } else {
          console.error('[AuthContext] Invalid response format:', response);
          dispatch({ type: "LOGIN_FAILURE", payload: "Dữ liệu từ server không hợp lệ." });
          return { ok: false };
        }
      } catch (error) {
        console.error('[AuthContext] Error fetching users:', error);
        console.error('[AuthContext] Error details:', {
          message: error?.message,
          code: error?.code,
          response: error?.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : null,
          request: error?.request ? 'Request made but no response' : null
        });
        
        let errorMessage = "Không thể tải danh sách người dùng.";
        if (error.response) {
          errorMessage += ` Lỗi server: ${error.response.status}`;
        } else if (error.request) {
          errorMessage += " Không thể kết nối đến server. Vui lòng kiểm tra json-server có đang chạy không.";
        } else {
          errorMessage += ` ${error.message}`;
        }
        
        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
        return { ok: false };
      }
      
      if (users.length === 0) {
        console.warn('[AuthContext] No users available');
        dispatch({ type: "LOGIN_FAILURE", payload: "Không tìm thấy người dùng nào trong hệ thống." });
        return { ok: false };
      }
      
      // Kiểm tra xem identifier có phải email không (có chứa "@")
      const isEmail = identifier.includes("@");
      
      console.log('[AuthContext] Searching for user:', { 
        identifier: identifier.trim(), 
        isEmail, 
        usersCount: users.length,
        users: users.map(u => ({ username: u.username, email: u.email }))
      });
      
      // Tìm user trong danh sách users khớp với identifier và password
      const account = users.find((acc) => {
        if (isEmail) {
          // Nếu là email → so sánh email (case-insensitive) và password
          const emailMatch = acc.email && 
                 acc.email.toLowerCase().trim() === identifier.toLowerCase().trim();
          const passwordMatch = acc.password === password;
          return emailMatch && passwordMatch;
        } else {
          // Nếu là username → so sánh username (case-insensitive) và password
          const usernameMatch = acc.username && 
                 acc.username.toLowerCase().trim() === identifier.toLowerCase().trim();
          const passwordMatch = acc.password === password;
          return usernameMatch && passwordMatch;
        }
      });
      
      console.log('[AuthContext] Account search result:', account ? { 
        id: account.id, 
        username: account.username, 
        email: account.email,
        status: account.status 
      } : 'Not found');
      
      // Nếu không tìm thấy user → login thất bại
      if (!account) {
        console.log('[AuthContext] Login failed: Invalid credentials');
        dispatch({ type: "LOGIN_FAILURE", payload: "Tên đăng nhập hoặc mật khẩu không đúng." });
        return { ok: false };
      }
      
      // Kiểm tra account có bị khóa không
      if (account.status === "locked") {
        console.log('[AuthContext] Login failed: Account locked');
        dispatch({ type: "LOGIN_FAILURE", payload: "Tài khoản đã bị khóa." });
        return { ok: false };
      }
      
      // Nếu hợp lệ → login thành công
      console.log('[AuthContext] Login success:', { 
        id: account.id, 
        username: account.username,
        email: account.email 
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: account });
      return { ok: true, account };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      dispatch({ type: "LOGIN_FAILURE", payload: "Đã xảy ra lỗi. Vui lòng thử lại." });
      return { ok: false };
    }
  }, []);

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