/**
 * LoginFormReducer.jsx - Reducer xử lý các action liên quan đến Form đăng nhập
 * 
 * Mục đích:
 * - Xử lý các action để cập nhật state của login form
 * - Được sử dụng trong LoginForm component với useReducer hook
 * - Quản lý state: identifier, password, errors, showSuccessModal
 * 
 * Actions được xử lý:
 * - SET_FIELD: Cập nhật giá trị của một field (identifier hoặc password)
 * - SET_ERROR: Set lỗi cho một field cụ thể
 * - CLEAR_ERROR: Xóa lỗi của một field cụ thể
 * - SET_ERRORS: Set tất cả lỗi cùng lúc (object chứa tất cả errors)
 * - RESET_FORM: Reset form về trạng thái ban đầu
 * - SHOW_SUCCESS_MODAL: Hiển thị modal thành công (set showSuccessModal = true)
 * - HIDE_SUCCESS_MODAL: Ẩn modal thành công (set showSuccessModal = false)
 * 
 * Được sử dụng ở:
 * - LoginForm.jsx: useReducer(loginFormReducer, initialFormState)
 * 
 * Reducer Pattern:
 * - Nhận vào state hiện tại và action
 * - Dựa vào action.type để quyết định cập nhật state như thế nào
 * - Luôn trả về state mới (immutable - không thay đổi state cũ)
 */

/**
 * initialFormState - State ban đầu của login form
 * 
 * @type {Object}
 * @property {string} identifier - Username hoặc email (rỗng ban đầu)
 * @property {string} password - Password (rỗng ban đầu)
 * @property {Object} errors - Object chứa các lỗi validation (rỗng ban đầu)
 *   Ví dụ: { identifier: "Username is required.", password: "Password is required." }
 * @property {boolean} showSuccessModal - Hiển thị modal thành công (false ban đầu)
 */
export const initialFormState = {
  identifier: "",           // Username hoặc email (input từ user)
  password: "",             // Password (input từ user)
  errors: {},               // Object chứa các lỗi validation: { identifier: "...", password: "..." }
  showSuccessModal: false,  // Hiển thị modal thành công (true = hiển thị, false = ẩn)
};

/**
 * loginFormReducer - Reducer function xử lý các action liên quan đến login form
 * 
 * @param {Object} state - State hiện tại { identifier, password, errors, showSuccessModal }
 * @param {Object} action - Action object { type: string, field?: string, value?: any, message?: string, errors?: Object }
 * @returns {Object} State mới sau khi xử lý action
 * 
 * Pattern:
 * - Sử dụng switch-case để xử lý từng loại action
 * - Luôn return state mới bằng cách spread state cũ và chỉ cập nhật các field cần thiết
 * - Không thay đổi state cũ (immutable)
 */
export const loginFormReducer = (state, action) => {
  switch (action.type) {
    /**
     * SET_FIELD: Cập nhật giá trị của một field
     * 
     * Được dispatch khi user nhập vào input (trong handleChange)
     * 
     * Action format: { type: "SET_FIELD", field: "identifier" | "password", value: string }
     * 
     * Ví dụ:
     * - dispatch({ type: "SET_FIELD", field: "identifier", value: "tai" })
     * - dispatch({ type: "SET_FIELD", field: "password", value: "123456" })
     * 
     * Cập nhật:
     * - [action.field]: action.value (cập nhật field tương ứng với value mới)
     * - Giữ nguyên các field khác
     */
    case "SET_FIELD":
      // Spread state cũ và cập nhật field tương ứng
      // [action.field]: action.value - Dynamic property name
      // Ví dụ: Nếu field = "identifier" → { ...state, identifier: "tai" }
      return { ...state, [action.field]: action.value };
    
    /**
     * SET_ERROR: Set lỗi cho một field cụ thể
     * 
     * Được dispatch khi validation phát hiện lỗi ở một field
     * 
     * Action format: { type: "SET_ERROR", field: "identifier" | "password", message: string }
     * 
     * Ví dụ:
     * - dispatch({ type: "SET_ERROR", field: "identifier", message: "Username is required." })
     * 
     * Cập nhật:
     * - errors: { ...state.errors, [action.field]: action.message }
     * - Giữ nguyên các field khác
     */
    case "SET_ERROR":
      // Spread state cũ và errors cũ, thêm error mới cho field tương ứng
      // Ví dụ: Nếu errors = { password: "..." }, field = "identifier", message = "Required"
      // → errors mới = { password: "...", identifier: "Required" }
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    
    /**
     * CLEAR_ERROR: Xóa lỗi của một field cụ thể
     * 
     * Được dispatch khi validation pass cho một field (không còn lỗi)
     * 
     * Action format: { type: "CLEAR_ERROR", field: "identifier" | "password" }
     * 
     * Ví dụ:
     * - dispatch({ type: "CLEAR_ERROR", field: "identifier" })
     * 
     * Logic:
     * - Sử dụng destructuring để loại bỏ field khỏi errors object
     * - const { [action.field]: _, ...rest } = state.errors
     *   - _ là biến không dùng (discard) để lấy field cần xóa
     *   - rest là object còn lại sau khi loại bỏ field đó
     * 
     * Cập nhật:
     * - errors: rest (errors mới không có field đó)
     * - Giữ nguyên các field khác
     */
    case "CLEAR_ERROR":
      // Destructuring để loại bỏ field khỏi errors object
      // Ví dụ: Nếu errors = { identifier: "Required", password: "Required" }
      //        và field = "identifier"
      // → _ = "Required" (giá trị của identifier, không dùng)
      // → rest = { password: "Required" }
      const { [action.field]: _, ...rest } = state.errors;
      return { ...state, errors: rest };
    
    /**
     * SET_ERRORS: Set tất cả lỗi cùng lúc
     * 
     * Được dispatch sau khi validate toàn bộ form (trong validateForm)
     * 
     * Action format: { type: "SET_ERRORS", errors: { identifier?: string, password?: string } }
     * 
     * Ví dụ:
     * - dispatch({ type: "SET_ERRORS", errors: { identifier: "Required", password: "Required" } })
     * 
     * Cập nhật:
     * - errors: action.errors (thay thế toàn bộ errors)
     * - Giữ nguyên các field khác
     */
    case "SET_ERRORS":
      // Spread state cũ và thay thế errors bằng errors mới
      // Thay thế toàn bộ errors (không merge) để đảm bảo chỉ có các lỗi mới nhất
      return { ...state, errors: action.errors };
    
    /**
     * RESET_FORM: Reset form về trạng thái ban đầu
     * 
     * Được dispatch khi user click "Reset" button hoặc cần reset form
     * 
     * Cập nhật:
     * - Reset về initialFormState (identifier: "", password: "", errors: {}, showSuccessModal: false)
     */
    case "RESET_FORM":
      // Trả về initialFormState - reset về trạng thái ban đầu
      return initialFormState;
    
    /**
     * SHOW_SUCCESS_MODAL: Hiển thị modal thành công
     * 
     * Được dispatch sau khi đăng nhập thành công
     * 
     * Cập nhật:
     * - showSuccessModal: true (hiển thị modal)
     * - Giữ nguyên các field khác
     */
    case "SHOW_SUCCESS_MODAL":
      // Spread state cũ và cập nhật showSuccessModal = true
      return { ...state, showSuccessModal: true };
    
    /**
     * HIDE_SUCCESS_MODAL: Ẩn modal thành công
     * 
     * Được dispatch khi cần đóng modal
     * 
     * Cập nhật:
     * - showSuccessModal: false (ẩn modal)
     * - Giữ nguyên các field khác
     */
    case "HIDE_SUCCESS_MODAL":
      // Spread state cũ và cập nhật showSuccessModal = false
      return { ...state, showSuccessModal: false };
    
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