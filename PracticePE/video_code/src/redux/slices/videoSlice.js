/**
 * FILE: videoSlice.js
 * MỤC ĐÍCH: Quản lý state và logic của videos trong Redux
 * VỊ TRÍ: src/redux/slices/videoSlice.js
 * 
 * LUỒNG XỬ LÝ TỔNG QUÁT:
 * 1. Component Videos.jsx gọi: dispatch(fetchVideos())
 * 2. fetchVideos thunk được thực thi -> gọi API
 * 3. Redux tự động dispatch các action: pending -> fulfilled/rejected
 * 4. extraReducers xử lý các action -> cập nhật state
 * 5. Component tự động re-render khi state thay đổi (nhờ useSelector)
 * 
 * TẠI SAO DÙNG REDUX TOOLKIT?
 * - Redux Toolkit tích hợp sẵn Redux Thunk (cần cho 10 điểm)
 * - createAsyncThunk tự động xử lý async actions (pending/fulfilled/rejected)
 * - createSlice giảm boilerplate code (không cần viết action creators, action types thủ công)
 */

// Import các hàm từ Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import Axios instance để gọi API
import videoAPI from '../../api/videoAPI';

/**
 * ASYNC THUNK: fetchVideos
 * 
 * TẠI SAO GỌI LÀ "THUNK"?
 * - Thunk là function trả về một function thay vì giá trị trực tiếp
 * - createAsyncThunk tạo một thunk function
 * - Khi dispatch(fetchVideos()), Redux gọi function bên trong
 * 
 * LUỒNG XỬ LÝ CỦA createAsyncThunk:
 * 1. Tự động dispatch action: 'videos/fetchVideos/pending'
 * 2. Thực thi async function (gọi API)
 * 3a. Nếu thành công: dispatch 'videos/fetchVideos/fulfilled' với data
 * 3b. Nếu thất bại: dispatch 'videos/fetchVideos/rejected' với error
 * 
 * TẠI SAO DÙNG createAsyncThunk THAY VÌ async function thường?
 * - Tự động xử lý loading states (pending/fulfilled/rejected)
 * - Tự động dispatch actions
 * - Tích hợp sẵn với Redux Thunk middleware
 * - Đúng yêu cầu đề bài (Redux Thunk = 10 điểm)
 */
export const fetchVideos = createAsyncThunk(
  // 'videos/fetchVideos': Action type prefix
  // Redux sẽ tạo 3 action types:
  // - videos/fetchVideos/pending
  // - videos/fetchVideos/fulfilled
  // - videos/fetchVideos/rejected
  'videos/fetchVideos',
  
  // Async function: Thực thi logic fetch data
  // Redux sẽ tự động xử lý Promise này
  async () => {
    // Gọi GET request tới endpoint '/videos'
    // videoAPI tự động thêm baseURL: http://localhost:3001/videos
    const response = await videoAPI.get('/videos');
    
    // Trả về response.data (chỉ lấy data, không lấy headers, status, etc.)
    // Giá trị này sẽ được đưa vào action.payload trong fulfilled case
    return response.data;
  }
);

/**
 * REDUX SLICE: videoSlice
 * 
 * TẠI SAO GỌI LÀ "SLICE"?
 * - Slice = một phần của Redux state tree
 * - Mỗi slice quản lý một domain cụ thể (ở đây là videos)
 * 
 * LUỒNG XỬ LÝ:
 * 1. createSlice tự động tạo:
 *    - Action creators (nếu có reducers)
 *    - Action types
 *    - Reducer function
 * 2. extraReducers xử lý actions từ async thunk
 * 3. Reducer trả về state mới (immutable)
 */
const videoSlice = createSlice({
  // name: Tên của slice (dùng làm prefix cho action types)
  // Nếu có reducer 'setVideos', action type sẽ là: 'videos/setVideos'
  name: 'videos',
  
  // initialState: State ban đầu khi app khởi động
  // Cấu trúc state: { videos: [], loading: false, error: null }
  initialState: { 
    videos: [],      // Mảng chứa danh sách videos (ban đầu rỗng)
    loading: false,  // Flag đánh dấu đang fetch data (ban đầu false)
    error: null      // Lỗi nếu có (ban đầu null)
  },
  
  // reducers: Các reducers đồng bộ (không cần async)
  // Trong trường hợp này, tất cả logic đều async nên để rỗng
  // Nếu muốn thêm action đồng bộ, ví dụ:
  // reducers: {
  //   clearVideos: (state) => {
  //     state.videos = [];
  //   }
  // }
  reducers: {},
  
  // extraReducers: Xử lý actions từ async thunk (fetchVideos)
  // Builder pattern: Cho phép thêm nhiều case handlers
  extraReducers: (builder) => {
    builder
      /**
       * CASE: fetchVideos.pending
       * Khi nào xảy ra: Ngay khi dispatch(fetchVideos()) được gọi
       * 
       * LUỒNG:
       * 1. Component gọi: dispatch(fetchVideos())
       * 2. Redux tự động dispatch: { type: 'videos/fetchVideos/pending' }
       * 3. Case này được trigger
       * 4. State được cập nhật: loading = true, error = null
       * 5. Component hiển thị loading spinner
       */
      .addCase(fetchVideos.pending, (state) => {
        // Set loading = true: Báo hiệu đang fetch data
        // Component có thể dùng để hiển thị spinner
        state.loading = true;
        
        // Clear error: Nếu có lỗi trước đó, reset về null
        // Tránh hiển thị lỗi cũ khi fetch mới
        state.error = null;
      })
      
      /**
       * CASE: fetchVideos.fulfilled
       * Khi nào xảy ra: Khi API call thành công và có data
       * 
       * LUỒNG:
       * 1. videoAPI.get('/videos') trả về response thành công
       * 2. Redux tự động dispatch: { type: 'videos/fetchVideos/fulfilled', payload: response.data }
       * 3. Case này được trigger với action.payload = mảng videos
       * 4. State được cập nhật: loading = false, videos = data mới
       * 5. Component tự động re-render với videos mới
       */
      .addCase(fetchVideos.fulfilled, (state, action) => {
        // Set loading = false: Fetch đã hoàn thành
        state.loading = false;
        
        // Lưu data vào state.videos
        // action.payload = giá trị return từ async function (response.data)
        // response.data là mảng videos từ JSON Server
        state.videos = action.payload;
      })
      
      /**
       * CASE: fetchVideos.rejected
       * Khi nào xảy ra: Khi API call thất bại (network error, server error, etc.)
       * 
       * LUỒNG:
       * 1. videoAPI.get('/videos') throw error (hoặc reject Promise)
       * 2. Redux tự động dispatch: { type: 'videos/fetchVideos/rejected', error: {...} }
       * 3. Case này được trigger với action.error chứa thông tin lỗi
       * 4. State được cập nhật: loading = false, error = error message
       * 5. Component hiển thị error message
       */
      .addCase(fetchVideos.rejected, (state, action) => {
        // Set loading = false: Fetch đã kết thúc (dù thành công hay thất bại)
        state.loading = false;
        
        // Lưu error message vào state
        // action.error.message chứa thông báo lỗi từ axios
        // Ví dụ: "Network Error", "Request failed with status code 404", etc.
        state.error = action.error.message;
      });
  },
});

/**
 * Export reducer để sử dụng trong store
 * 
 * LUỒNG:
 * 1. Store.js import videoSlice.reducer
 * 2. Kết nối vào store: reducer: { videos: videoReducer }
 * 3. State tree có dạng: { videos: { videos: [], loading: false, error: null } }
 * 4. Component access: useSelector((state) => state.videos)
 */
export default videoSlice.reducer;
