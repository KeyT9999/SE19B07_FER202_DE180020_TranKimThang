/**
 * AuthContext.jsx - Quản lý xác thực người dùng bằng Context API và useReducer
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Quản lý trạng thái đăng nhập (isAuthenticated, user, loading, error)
 * 2. Cung cấp functions: login, logout, clearError
 * 3. Lưu thông tin user vào localStorage để giữ đăng nhập sau khi refresh
 * 4. Sử dụng useReducer để quản lý state phức tạp
 * 
 * LUỒNG XỬ LÝ LOGIN:
 * 1. User nhập username/email và password trong LoginForm
 * 2. LoginForm gọi login() từ AuthContext
 * 3. login() gọi API getUsers() để lấy danh sách users
 * 4. Tìm user khớp với username/email và password
 * 5. Kiểm tra status user (phải là 'active')
 * 6. Nếu hợp lệ: Lưu user vào localStorage và cập nhật state
 * 7. Nếu không hợp lệ: Trả về lỗi
 */

// Import các hooks và thư viện cần thiết từ React
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

// Import API service để gọi các API liên quan đến user
import * as api from '../services/api';

// ==========================================
// 1. TẠO CONTEXT
// ==========================================
// Tạo Context để chia sẻ authentication state và functions giữa các components
// Context này sẽ được cung cấp bởi AuthProvider và sử dụng bởi useAuth hook
const AuthContext = createContext();

// ==========================================
// 2. KHỞI TẠO TRẠNG THÁI BAN ĐẦU
// ==========================================

/**
 * getUserFromStorage() - Hàm lấy thông tin user từ localStorage
 * 
 * LUỒNG XỬ LÝ:
 * 1. Lấy chuỗi JSON từ localStorage với key 'user'
 * 2. Parse JSON thành object
 * 3. Nếu có lỗi (dữ liệu không hợp lệ), xóa dữ liệu và trả về null
 * 4. Trả về user object hoặc null
 * 
 * LÝ DO: Giữ đăng nhập sau khi refresh trang
 */
const getUserFromStorage = () => {
    try {
        // Lấy chuỗi JSON từ localStorage
        const userStr = localStorage.getItem('user');
        
        // Nếu không có dữ liệu, trả về null
        if (!userStr) return null;
        
        // Parse JSON thành object JavaScript
        return JSON.parse(userStr);
    } catch (error) {
        // Nếu có lỗi khi parse (dữ liệu bị corrupt), xóa dữ liệu không hợp lệ
        localStorage.removeItem('user');
        return null;
    }
};

/**
 * initialAuthState - Trạng thái khởi tạo của authentication
 * 
 * CÁC TRƯỜNG:
 * - isAuthenticated: false - Chưa đăng nhập
 * - user: null hoặc user object từ localStorage - Thông tin user hiện tại
 * - isLoading: false - Không đang loading
 * - error: null - Không có lỗi
 */
const initialAuthState = {
    isAuthenticated: false,  // Trạng thái đăng nhập: false = chưa đăng nhập
    user: getUserFromStorage(),  // Lấy user từ localStorage (nếu có)
    isLoading: false,  // Trạng thái loading: false = không đang tải
    error: null,  // Lỗi: null = không có lỗi
};

// Nếu đã có user trong localStorage, set isAuthenticated = true
// LÝ DO: Giữ đăng nhập sau khi refresh trang
if (initialAuthState.user) {
    initialAuthState.isAuthenticated = true;
}

// ==========================================
// 3. REDUCER - QUẢN LÝ CÁC HÀNH ĐỘNG
// ==========================================

/**
 * authReducer - Hàm xử lý các action để cập nhật state
 * 
 * CÁC ACTION:
 * - LOGIN_START: Bắt đầu quá trình đăng nhập (set loading = true)
 * - LOGIN_SUCCESS: Đăng nhập thành công (lưu user, set isAuthenticated = true)
 * - LOGIN_FAILURE: Đăng nhập thất bại (set error message)
 * - LOGOUT: Đăng xuất (xóa user, set isAuthenticated = false)
 * - CLEAR_ERROR: Xóa lỗi
 * 
 * LUỒNG XỬ LÝ:
 * 1. Nhận action type và payload
 * 2. Dựa vào action type, cập nhật state tương ứng
 * 3. Trả về state mới (không mutate state cũ)
 */
const authReducer = (state, action) => {
    switch (action.type) { 
        case 'LOGIN_START':
            // Bắt đầu đăng nhập: set loading = true, xóa lỗi cũ
            return { ...state, isLoading: true, error: null };
            
        case 'LOGIN_SUCCESS':
            // Đăng nhập thành công:
            // 1. Lưu user vào localStorage để giữ đăng nhập sau khi refresh
            localStorage.setItem('user', JSON.stringify(action.payload));
            // 2. Cập nhật state: loading = false, isAuthenticated = true, user = payload, error = null
            return { 
                ...state, 
                isLoading: false, 
                isAuthenticated: true, 
                user: action.payload, 
                error: null 
            };
            
        case 'LOGIN_FAILURE':
            // Đăng nhập thất bại: set loading = false, lưu error message
            return { ...state, isLoading: false, error: action.payload };
            
        case 'LOGOUT':
            // Đăng xuất:
            // 1. Xóa user khỏi localStorage
            localStorage.removeItem('user');
            // 2. Reset về trạng thái ban đầu: isAuthenticated = false, user = null
            return { ...initialAuthState, isAuthenticated: false, user: null };
            
        case 'CLEAR_ERROR':
            // Xóa lỗi: set error = null
            // Dùng khi user nhập lại để xóa lỗi cũ
            return { ...state, error: null };
            
        default:
            // Nếu không có action nào khớp, trả về state cũ (không thay đổi)
            return state;
    }
};

// ==========================================
// 4. AUTH PROVIDER - CUNG CẤP CONTEXT
// ==========================================

/**
 * AuthProvider - Component cung cấp authentication context cho các component con
 * 
 * LUỒNG XỬ LÝ:
 * 1. Sử dụng useReducer để quản lý authentication state
 * 2. Định nghĩa các functions: login, logout, clearError
 * 3. Sử dụng useMemo và useCallback để tối ưu performance
 * 4. Cung cấp context value cho các component con
 * 
 * @param {React.ReactNode} children - Các component con sẽ được wrap bởi AuthProvider
 */
export const AuthProvider = ({ children }) => {
    // Sử dụng useReducer để quản lý state phức tạp
    // state: Trạng thái hiện tại (isAuthenticated, user, loading, error)
    // dispatch: Hàm để dispatch action và cập nhật state
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    // ==========================================
    // ĐỊNH NGHĨA CÁC FUNCTIONS
    // ==========================================

    /**
     * clearError() - Xóa lỗi authentication
     * 
     * Sử dụng useCallback để tránh tạo function mới mỗi lần render
     * (tối ưu performance)
     */
    const clearError = useCallback(() => {
        // Dispatch action CLEAR_ERROR để xóa lỗi
        dispatch({ type: 'CLEAR_ERROR' });
    }, []); // Empty dependency array = function không thay đổi

    /**
     * login() - Hàm đăng nhập
     * 
     * LUỒNG XỬ LÝ:
     * 1. Dispatch LOGIN_START (set loading = true)
     * 2. Gọi API getUsers() để lấy danh sách users
     * 3. Tìm user khớp với username/email và password
     * 4. Kiểm tra status user (phải là 'active')
     * 5. Nếu hợp lệ: Dispatch LOGIN_SUCCESS (lưu user, set isAuthenticated = true)
     * 6. Nếu không hợp lệ: Dispatch LOGIN_FAILURE (set error message)
     * 
     * @param {string} usernameOrEmail - Username hoặc email của user
     * @param {string} password - Password của user
     * @returns {Object} { success: boolean, user?: Object, error?: string }
     */
    const login = useCallback(async ({ usernameOrEmail, password }) => {
        // Bước 1: Bắt đầu quá trình đăng nhập (set loading = true, xóa lỗi cũ)
        dispatch({ type: 'LOGIN_START' });
        
        try {
            // Bước 2: Gọi API để lấy danh sách users từ server (db.json)
            const accounts = await api.getUsers();
            
            // Bước 3: Tìm user khớp với username/email và password
            // - Kiểm tra username HOẶC email (nếu có)
            // - Kiểm tra password phải khớp
            const user = accounts.find(
                (acc) =>
                    // Kiểm tra username hoặc email khớp
                    (acc.username === usernameOrEmail || 
                     (acc.email && acc.email === usernameOrEmail)) &&
                    // Kiểm tra password khớp
                    acc.password === password
            );

            // Bước 4: Xử lý kết quả tìm kiếm
            if (user) { 
                // Tìm thấy user, kiểm tra status
                // Chỉ cho phép user có status = 'active' đăng nhập
                if (user.status !== 'active') {
                    // User bị khóa, trả về lỗi
                    const errorMessage = 'Tài khoản bị khóa, bạn không có quyền truy cập.';
                    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
                    return { success: false, error: errorMessage };
                }
                
                // User hợp lệ, đăng nhập thành công
                // Dispatch LOGIN_SUCCESS: Lưu user vào localStorage và cập nhật state
                dispatch({ type: 'LOGIN_SUCCESS', payload: user });
                return { success: true, user };
            } else { 
                // Không tìm thấy user (username/email hoặc password sai)
                const errorMessage = 'Invalid username/email or password!';
                dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            // Lỗi mạng hoặc lỗi từ API
            const errorMessage = error.message || 'Login failed due to a network error.';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    }, []); // Empty dependency array = function không thay đổi

    /**
     * logout() - Hàm đăng xuất
     * 
     * LUỒNG XỬ LÝ:
     * 1. Dispatch LOGOUT action
     * 2. Reducer sẽ xóa user khỏi localStorage và reset state
     */
    const logout = useCallback(() => {
        // Dispatch LOGOUT: Xóa user khỏi localStorage và reset state
        dispatch({ type: 'LOGOUT' });
    }, []); // Empty dependency array = function không thay đổi

    // ==========================================
    // TẠO CONTEXT VALUE
    // ==========================================

    /**
     * contextValue - Giá trị được cung cấp cho các component con qua Context
     * 
     * Sử dụng useMemo để tránh tạo object mới mỗi lần render
     * (tối ưu performance - tránh re-render không cần thiết các component con)
     * 
     * CHỈ TẠO OBJECT MỚI KHI:
     * - state.isAuthenticated thay đổi
     * - state.user thay đổi
     * - state.isLoading thay đổi
     * - state.error thay đổi
     * - login, logout, clearError thay đổi (nhưng chúng đã được memoize bằng useCallback)
     */
    const contextValue = useMemo(() => ({
        // Trạng thái từ Reducer
        isAuthenticated: state.isAuthenticated,  // Trạng thái đăng nhập
        user: state.user,  // Thông tin user hiện tại
        loading: state.isLoading,  // Trạng thái loading
        error: state.error,  // Lỗi (nếu có)
        
        // Actions (functions)
        login,  // Hàm đăng nhập
        logout,  // Hàm đăng xuất
        clearError,  // Hàm xóa lỗi
    }), [
        state.isAuthenticated,  // Chỉ tạo object mới khi isAuthenticated thay đổi
        state.user,  // Chỉ tạo object mới khi user thay đổi
        state.isLoading,  // Chỉ tạo object mới khi isLoading thay đổi
        state.error,  // Chỉ tạo object mới khi error thay đổi
        login,  // Chỉ tạo object mới khi login thay đổi (nhưng đã được memoize)
        logout,  // Chỉ tạo object mới khi logout thay đổi (nhưng đã được memoize)
        clearError  // Chỉ tạo object mới khi clearError thay đổi (nhưng đã được memoize)
    ]);

    // ==========================================
    // RENDER
    // ==========================================

    // Cung cấp context value cho tất cả components con
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ==========================================
// 5. CUSTOM HOOK - SỬ DỤNG CONTEXT
// ==========================================

/**
 * useAuth() - Custom hook để sử dụng AuthContext dễ dàng hơn
 * 
 * CÁCH SỬ DỤNG:
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * LỢI ÍCH:
 * - Không cần import useContext và AuthContext
 * - Code ngắn gọn và dễ đọc hơn
 * - Có thể thêm validation hoặc logic bổ sung ở đây
 * 
 * @returns {Object} Context value (isAuthenticated, user, loading, error, login, logout, clearError)
 */
export const useAuth = () => useContext(AuthContext);
