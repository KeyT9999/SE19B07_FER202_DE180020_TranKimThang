/**
 * FILE: storeContext.jsx
 * TÁC DỤNG: File này tạo Context API để chia sẻ state và functions giữa các components
 * FOLDER: src/context/ - Chứa các Context providers để quản lý global state
 * 
 * Giải thích:
 * - Context API là cách React chia sẻ data giữa các components mà không cần prop drilling
 * - StoreProvider bao bọc App để cung cấp state cho tất cả components con
 * - useStoreState() và useStoreDispatch() là custom hooks để lấy state và functions
 * 
 * MAPPING:
 * - index.js → StoreProvider → App → tất cả components có thể dùng useStoreState/useStoreDispatch
 */

// Import các hooks và utilities từ React
import React, {
  createContext, // Tạo Context object
  useReducer, // Hook để quản lý state với reducer
  useContext, // Hook để lấy giá trị từ Context
  useEffect, // Hook để chạy side effects (như gọi API)
  useCallback, // Hook để memoize functions, tránh re-render không cần thiết
} from "react";

// Import reducer và initial state từ storeReducer
import { storeReducer, initialStoreState } from "../reducers/storeReducer";

// Import API instance để gọi HTTP requests
import storeAPI from "../api/StoreAPI";

// ============================================
// CONTEXTS - Tạo Context objects để chia sẻ data
// ============================================

// Context chứa State (dữ liệu) của Store
// Giá trị mặc định là initialStoreState
export const StoreStateContext = createContext(initialStoreState);

// Context chứa Dispatch (các functions để thay đổi state)
// Giá trị mặc định là null
export const StoreDispatchContext = createContext(null);

// ============================================
// CUSTOM HOOKS - Hàm tiện ích để dùng Context
// ============================================

/**
 * Custom hook để lấy State từ StoreStateContext
 * @returns {Object} - State hiện tại (chứa store và loading)
 * 
 * CÁCH DÙNG trong component:
 * const { store } = useStoreState();
 * console.log(store.products); // Lấy danh sách sản phẩm
 */
export const useStoreState = () => useContext(StoreStateContext);

/**
 * Custom hook để lấy Dispatch functions từ StoreDispatchContext
 * @returns {Object} - Object chứa các functions: dispatch, fetchStore, handleCreateOrUpdate
 * 
 * CÁCH DÙNG trong component:
 * const { handleCreateOrUpdate } = useStoreDispatch();
 * handleCreateOrUpdate(productData, true, productId);
 */
export const useStoreDispatch = () => useContext(StoreDispatchContext);

// ============================================
// STORE PROVIDER - Component bao bọc App để cung cấp Context
// ============================================

/**
 * StoreProvider Component
 * @param {Object} props - Props object
 * @param {ReactNode} props.children - Các components con (như App)
 * 
 * TÁC DỤNG:
 * - Quản lý state global của Store bằng useReducer
 * - Cung cấp state và functions cho tất cả components con
 * - Tự động fetch dữ liệu từ API khi component mount
 */
export const StoreProvider = ({ children }) => {
  // useReducer: quản lý state với reducer pattern
  // state: state hiện tại (chứa store và loading)
  // dispatch: function để gửi action đến reducer
  const [state, dispatch] = useReducer(storeReducer, initialStoreState);

  // ============================================
  // FUNCTION: READ - Tải dữ liệu từ API
  // ============================================

  /**
   * Hàm fetchStore: Gọi API để lấy dữ liệu store từ server
   * useCallback: Memoize function để tránh re-create khi re-render
   * [dispatch]: Dependency array, chỉ tạo lại function khi dispatch thay đổi
   */
  const fetchStore = useCallback(async () => {
    // Dispatch action START_LOADING để bật loading state
    dispatch({ type: "START_LOADING" });
    
    try {
      // Gọi API GET /store để lấy dữ liệu
      // storeAPI.get("/store") = http://localhost:3001/store
      const response = await storeAPI.get("/store");
      
      // Dispatch action SET_STORE với dữ liệu từ API
      // response.data là dữ liệu từ server (từ db.json)
      dispatch({ type: "SET_STORE", payload: response.data });
    } catch (error) {
      // Nếu có lỗi, log ra console
      console.error("Lỗi khi tải danh sách cửa hàng:", error);
      
      // Set store về mảng rỗng để tránh lỗi
      dispatch({ type: "SET_STORE", payload: [] });
    }
  }, [dispatch]);

  // ============================================
  // FUNCTION: CREATE/UPDATE - Tạo mới hoặc cập nhật sản phẩm
  // ============================================

  /**
   * Hàm handleCreateOrUpdate: Xử lý tạo mới hoặc cập nhật sản phẩm
   * @param {Object} dataToSend - Dữ liệu sản phẩm cần tạo/cập nhật
   * @param {Boolean} isEditing - true nếu đang edit, false nếu đang tạo mới
   * @param {Number} isEditingId - ID của sản phẩm đang edit (nếu isEditing = true)
   * @returns {Boolean} - true nếu thành công, false nếu thất bại
   */
  const handleCreateOrUpdate = useCallback(
    async (dataToSend, isEditing, isEditingId) => {
      // Bật loading state
      dispatch({ type: "START_LOADING" });
      
      try {
        if (isEditing) {
          // ========== CẬP NHẬT SẢN PHẨM ==========
          
          // Cập nhật trong state (UI) ngay lập tức
          dispatch({ type: "UPDATE_PRODUCT", payload: dataToSend });

          // Tạo mảng products mới: thay thế sản phẩm có id = isEditingId bằng dataToSend
          const updatedProducts = state.store.products.map((p) =>
            p.id === isEditingId ? dataToSend : p
          );
          
          // Tạo store object mới với products đã cập nhật
          const updatedStore = { ...state.store, products: updatedProducts };

          // Gọi API PUT để lưu lên server
          // PUT /store sẽ thay thế toàn bộ store object
          await storeAPI.put("/store", updatedStore);
        } else {
          // ========== TẠO MỚI SẢN PHẨM ==========
          
          // Thêm sản phẩm mới vào mảng products
          // ...state.store.products: copy mảng cũ
          // dataToSend: thêm sản phẩm mới vào cuối
          const updatedStore = {
            ...state.store,
            products: [...state.store.products, dataToSend],
          };
          
          // Gọi API PUT để lưu lên server
          await storeAPI.put("/store", updatedStore);
        }

        // Sau khi thành công, fetch lại dữ liệu từ server để đồng bộ
        fetchStore();
        return true; // Trả về true nếu thành công
      } catch (error) {
        // Nếu có lỗi, log ra console
        console.error("Lỗi thao tác CREATE/UPDATE:", error);
        
        // Vẫn fetch lại để đảm bảo UI đồng bộ với server
        fetchStore();
        return false; // Trả về false nếu thất bại
      }
    },
    [state.store, fetchStore] // Dependencies: chỉ tạo lại function khi state.store hoặc fetchStore thay đổi
  );

  // ============================================
  // EFFECT: Tự động fetch dữ liệu khi component mount
  // ============================================

  /**
   * useEffect: Chạy khi component mount (lần đầu render)
   * [fetchStore]: Chỉ chạy lại nếu fetchStore thay đổi
   * 
   * TÁC DỤNG: Tự động tải dữ liệu từ API khi app khởi động
   */
  useEffect(() => {
    fetchStore(); // Gọi API để lấy dữ liệu
  }, [fetchStore]);

  // ============================================
  // PROVIDER VALUE: Các functions và state để chia sẻ
  // ============================================

  // Object chứa các functions để các components con có thể dùng
  const dispatchValue = {
    dispatch, // Function gửi action trực tiếp đến reducer
    fetchStore, // Function gọi API để tải lại dữ liệu
    handleCreateOrUpdate, // Function tạo/cập nhật sản phẩm
  };

  // ============================================
  // RENDER: Provider components để chia sẻ Context
  // ============================================

  return (
    // StoreStateContext.Provider: Cung cấp state cho components con
    <StoreStateContext.Provider value={state}>
      {/* StoreDispatchContext.Provider: Cung cấp functions cho components con */}
      <StoreDispatchContext.Provider value={dispatchValue}>
        {/* children: Các components con (như App) */}
        {children}
      </StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};
