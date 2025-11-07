/**
 * FILE: store.js
 * MỤC ĐÍCH: Cấu hình và tạo Redux Store - trung tâm quản lý state của ứng dụng
 * VỊ TRÍ: src/redux/store.js
 * 
 * LUỒNG TỔNG QUÁT CỦA REDUX:
 * 1. Store chứa toàn bộ state của app
 * 2. Component dispatch actions -> Store nhận actions
 * 3. Store gọi reducers -> Reducers xử lý actions -> Cập nhật state
 * 4. Store thông báo component state đã thay đổi
 * 5. Component re-render với state mới (thông qua useSelector)
 * 
 * TẠI SAO CẦN REDUX STORE?
 * - Quản lý state tập trung (thay vì prop drilling)
 * - Dễ dàng debug (Redux DevTools)
 * - Predictable state updates (chỉ thay đổi qua actions)
 * - Hỗ trợ middleware (như Redux Thunk cho async actions)
 */

// Import configureStore từ Redux Toolkit
// configureStore là phiên bản cải tiến của createStore (Redux cũ)
// Tích hợp sẵn Redux Thunk middleware (cần cho 10 điểm)
import { configureStore } from '@reduxjs/toolkit';
// Import reducer từ videoSlice
import videoReducer from './slices/videoSlice';

/**
 * REDUX STORE: Trung tâm quản lý state
 * 
 * TẠI SAO DÙNG configureStore THAY VÌ createStore?
 * - configureStore tích hợp sẵn Redux Thunk middleware
 * - Tự động bật Redux DevTools (trình debug)
 * - Tự động kiểm tra lỗi phổ biến (mutations, etc.)
 * - Đơn giản hơn, ít code hơn
 * 
 * LUỒNG KẾT NỐI:
 * 1. Store chứa videoReducer
 * 2. videoReducer quản lý state của videos
 * 3. State tree có dạng: {
 *      videos: {
 *        videos: [],      // Danh sách videos
 *        loading: false,  // Đang tải?
 *        error: null      // Lỗi nếu có
 *      }
 *    }
 * 4. Component access: useSelector((state) => state.videos)
 */
const store = configureStore({
  // reducer: Object chứa tất cả các reducers
  // Key 'videos' là tên của state slice trong store
  // Component sẽ access qua: state.videos
  reducer: {
    // videoReducer: Reducer từ videoSlice
    // Khi dispatch action liên quan đến videos, store sẽ gọi reducer này
    // Ví dụ: dispatch(fetchVideos()) -> store gọi videoReducer với action
    videos: videoReducer,
    
    // Nếu có nhiều slices, thêm vào đây:
    // users: userReducer,
    // posts: postReducer,
  },
  
  // configureStore tự động thêm:
  // - Redux Thunk middleware (cho async actions)
  // - Redux DevTools extension (nếu cài đặt)
  // - Immutability checks (phát hiện mutations)
});

/**
 * Export store để sử dụng trong Provider
 * 
 * LUỒNG SỬ DỤNG:
 * 1. index.js import store
 * 2. Wrap App với <Provider store={store}>
 * 3. Tất cả components bên trong có thể dùng:
 *    - useDispatch() để dispatch actions
 *    - useSelector() để lấy state
 */
export default store;
