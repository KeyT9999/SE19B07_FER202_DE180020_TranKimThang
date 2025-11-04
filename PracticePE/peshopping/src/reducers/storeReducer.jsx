/**
 * FILE: storeReducer.jsx
 * TÁC DỤNG: File này định nghĩa Reducer để quản lý state của Store (cửa hàng)
 * FOLDER: src/reducers/ - Chứa các Reducer functions để xử lý state changes
 * 
 * Giải thích:
 * - Reducer là một function nhận vào (state, action) và trả về state mới
 * - Dùng pattern Redux để quản lý state tập trung
 * - Mỗi action type sẽ thay đổi state theo cách khác nhau
 */

// Định nghĩa state ban đầu của Store
export const initialStoreState = {
  store: {
    products: [], // Mảng chứa danh sách sản phẩm, ban đầu rỗng
  },
  loading: false, // Flag để biết đang tải dữ liệu hay không
};

/**
 * Reducer function - xử lý các action để thay đổi state
 * @param {Object} state - State hiện tại
 * @param {Object} action - Action object có type và payload
 * @returns {Object} - State mới sau khi xử lý action
 */
export const storeReducer = (state, action) => {
  // Switch case để xử lý từng loại action
  switch (action.type) {
    // Action: Bắt đầu tải dữ liệu
    case "START_LOADING":
      // Trả về state mới với loading = true
      return { ...state, loading: true };
      // ...state là spread operator, copy tất cả properties của state cũ
      // loading: true là ghi đè property loading

    // Action: Set dữ liệu store từ API
    case "SET_STORE":
      // Trả về state mới với store = payload từ API, và loading = false
      return { ...state, store: action.payload, loading: false };
      // action.payload chứa dữ liệu từ API response

    // Action: Cập nhật một sản phẩm trong danh sách
    case "UPDATE_PRODUCT":
      return {
        ...state, // Copy state cũ
        store: {
          ...state.store, // Copy store cũ
          // Map qua mảng products, tìm sản phẩm có id = action.payload.id
          // Nếu tìm thấy thì thay thế bằng action.payload (sản phẩm mới)
          // Nếu không thì giữ nguyên sản phẩm cũ
          products: state.store.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          ),
        },
        loading: false, // Đã cập nhật xong, không còn loading
      };

    // Action mặc định: không match case nào thì trả về state cũ
    default:
      return state;
  }
};
