/**
 * AuthReducer.jsx - Reducer xử lý các action liên quan đến Authentication
 * 
 * Mục đích:
 * - Xử lý các action để cập nhật state của authentication
 * - Được sử dụng trong AuthContext với useReducer hook
 * - Quản lý state: user, users, loading, error, isAuthenticated
 * 
 * Actions được xử lý:
 * - START_LOADING: Bắt đầu loading (set loading = true)
 * - SET_USERS: Lưu danh sách users từ server (set users, loading = false)
 * - LOGIN_START: Bắt đầu quá trình đăng nhập (set loading = true, error = null)
 * - LOGIN_SUCCESS: Đăng nhập thành công (set user, isAuthenticated = true, loading = false)
 * - LOGIN_FAILURE: Đăng nhập thất bại (set error, isAuthenticated = false, loading = false)
 * - LOGOUT: Đăng xuất (set user = null, isAuthenticated = false)
 * - CLEAR_ERROR: Xóa error (set error = null)
 * 
 * Được sử dụng ở:
 * - AuthContext.jsx: useReducer(authReducer, initialState)
 * 
 * Reducer Pattern:
 * - Nhận vào state hiện tại và action
 * - Dựa vào action.type để quyết định cập nhật state như thế nào
 * - Luôn trả về state mới (immutable - không thay đổi state cũ)
 */

/**
 * Load user from localStorage on initialization
 * @returns {Object|null} User object if found in localStorage, null otherwise
 */
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('[AuthReducer] Loaded user from localStorage:', user.username);
      return user;
    }
  } catch (error) {
    console.error('[AuthReducer] Error loading user from localStorage:', error);
    localStorage.removeItem('auth_user');
  }
  return null;
};

/**
 * Save user to localStorage
 * @param {Object} user - User object to save
 */
const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('[AuthReducer] Saved user to localStorage:', user.username);
  } catch (error) {
    console.error('[AuthReducer] Error saving user to localStorage:', error);
  }
};

/**
 * Remove user from localStorage
 */
const removeUserFromStorage = () => {
  try {
    localStorage.removeItem('auth_user');
    console.log('[AuthReducer] Removed user from localStorage');
  } catch (error) {
    console.error('[AuthReducer] Error removing user from localStorage:', error);
  }
};

/**
 * initialState - State ban đầu của authentication
 * 
 * @type {Object}
 * @property {Object|null} user - User hiện tại đã đăng nhập (null nếu chưa đăng nhập)
 * @property {Array} users - Danh sách users từ server (rỗng ban đầu)
 * @property {boolean} loading - Trạng thái loading (false ban đầu)
 * @property {string|null} error - Lỗi nếu có (null nếu không có lỗi)
 * @property {boolean} isAuthenticated - Trạng thái đăng nhập (false ban đầu)
 */
const storedUser = loadUserFromStorage();
export const initialState = {
  user: storedUser,              // User hiện tại đã đăng nhập (load từ localStorage nếu có)
  users: [],               // Danh sách users từ JSON Server
  loading: false,          // Trạng thái loading (true = đang tải)
  error: null,             // Lỗi nếu có (null = không có lỗi)
  isAuthenticated: !!storedUser,  // Trạng thái đăng nhập (true nếu có user trong localStorage)
};

/**
 * authReducer - Reducer function xử lý các action liên quan đến authentication
 * 
 * @param {Object} state - State hiện tại { user, users, loading, error, isAuthenticated }
 * @param {Object} action - Action object { type: string, payload?: any }
 * @returns {Object} State mới sau khi xử lý action
 * 
 * Pattern:
 * - Sử dụng switch-case để xử lý từng loại action
 * - Luôn return state mới bằng cách spread state cũ và chỉ cập nhật các field cần thiết
 * - Không thay đổi state cũ (immutable)
 */
export const authReducer = (state, action) => {
  switch (action.type) {
    /**
     * START_LOADING: Bắt đầu loading
     * 
     * Được dispatch khi bắt đầu một async operation (ví dụ: fetch users)
     * 
     * Cập nhật:
     * - loading: true
     * - Giữ nguyên các field khác
     */
    case "START_LOADING":
      // Spread state cũ và chỉ cập nhật loading = true
      return { ...state, loading: true };
    
    /**
     * SET_USERS: Lưu danh sách users từ server
     * 
     * Được dispatch sau khi fetch users từ JSON Server thành công
     * 
     * Payload: Array chứa danh sách users
     * 
     * Cập nhật:
     * - users: action.payload (hoặc [] nếu payload là null/undefined)
     * - loading: false
     * - Giữ nguyên các field khác
     */
    case "SET_USERS":
      // Spread state cũ và cập nhật users, loading = false
      // action.payload || []: Nếu payload là null/undefined → dùng [] (empty array)
      return { ...state, loading: false, users: action.payload || [] };
    
    /**
     * LOGIN_START: Bắt đầu quá trình đăng nhập
     * 
     * Được dispatch khi bắt đầu xác thực đăng nhập
     * 
     * Cập nhật:
     * - loading: true (đang xử lý đăng nhập)
     * - error: null (clear error cũ)
     * - Giữ nguyên các field khác
     */
    case "LOGIN_START":
      // Spread state cũ và cập nhật loading = true, error = null
      return { ...state, loading: true, error: null };
    
    /**
     * LOGIN_SUCCESS: Đăng nhập thành công
     * 
     * Được dispatch khi tìm thấy user khớp với credentials
     * 
     * Payload: Object chứa thông tin user đã đăng nhập
     * 
     * Cập nhật:
     * - user: action.payload (user đã đăng nhập)
     * - loading: false (đã hoàn thành)
     * - isAuthenticated: true (đã đăng nhập thành công)
     * - Giữ nguyên users, error
     */
    case "LOGIN_SUCCESS":
      // Lưu user vào localStorage để giữ session
      saveUserToStorage(action.payload);
      // Spread state cũ và cập nhật user, loading = false, isAuthenticated = true
      return {
        ...state,
        user: action.payload,         // Lưu user đã đăng nhập
        loading: false,               // Hoàn thành loading
        isAuthenticated: true,        // Đã đăng nhập thành công
      };
    
    /**
     * LOGIN_FAILURE: Đăng nhập thất bại
     * 
     * Được dispatch khi không tìm thấy user hoặc credentials không đúng
     * 
     * Payload: String chứa thông báo lỗi (ví dụ: "Invalid credentials.")
     * 
     * Cập nhật:
     * - loading: false (đã hoàn thành, nhưng thất bại)
     * - error: action.payload (lưu thông báo lỗi)
     * - isAuthenticated: false (chưa đăng nhập)
     * - Giữ nguyên user, users
     */
    case "LOGIN_FAILURE":
      // Spread state cũ và cập nhật loading = false, error, isAuthenticated = false
      return {
        ...state,
        loading: false,               // Hoàn thành loading (nhưng thất bại)
        error: action.payload,        // Lưu thông báo lỗi
        isAuthenticated: false,       // Chưa đăng nhập
      };
    
    /**
     * LOGOUT: Đăng xuất
     * 
     * Được dispatch khi user đăng xuất
     * 
     * Cập nhật:
     * - user: null (xóa user hiện tại)
     * - isAuthenticated: false (chưa đăng nhập)
     * - Giữ nguyên users, loading, error
     */
    case "LOGOUT":
      // Xóa user khỏi localStorage khi đăng xuất
      removeUserFromStorage();
      // Spread state cũ và cập nhật user = null, isAuthenticated = false
      return { ...state, user: null, isAuthenticated: false };
    
    /**
     * CLEAR_ERROR: Xóa error
     * 
     * Được dispatch khi cần xóa thông báo lỗi (ví dụ: khi user bắt đầu nhập lại)
     * 
     * Cập nhật:
     * - error: null (xóa lỗi)
     * - Giữ nguyên các field khác
     */
    case "CLEAR_ERROR":
      // Spread state cũ và cập nhật error = null
      return { ...state, error: null };
    
    /**
     * default: Action không khớp với bất kỳ case nào
     * 
     * Trả về state hiện tại không thay đổi
     * Điều này đảm bảo reducer không bị crash khi có action không hợp lệ
     */
    default:
      // Trả về state hiện tại không thay đổi
      return state;
  }
};