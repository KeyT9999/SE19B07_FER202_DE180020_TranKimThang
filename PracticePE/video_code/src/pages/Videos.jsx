/**
 * FILE: Videos.jsx
 * MỤC ĐÍCH: Trang hiển thị danh sách videos - fetch data từ Redux và render Video components
 * VỊ TRÍ: src/pages/Videos.jsx
 * 
 * LUỒNG XỬ LÝ TỔNG QUÁT:
 * 1. Component mount (user truy cập '/videos')
 * 2. useEffect trigger -> dispatch(fetchVideos())
 * 3. Redux thunk gọi API -> JSON Server trả về data
 * 4. Redux cập nhật state: { videos: [...], loading: false, error: null }
 * 5. useSelector detect state change -> Component re-render
 * 6. Component render danh sách Video components với data mới
 * 
 * TẠI SAO DÙNG REDUX HOOKS?
 * - useDispatch: Dispatch actions (fetch data)
 * - useSelector: Subscribe state changes (auto re-render khi state thay đổi)
 * - Tách biệt data logic và UI logic
 * - Đúng yêu cầu đề bài: Redux + Redux Thunk (10 điểm)
 */

// Import React và useEffect hook
// useEffect: Side effect hook (chạy sau khi render)
import React, { useEffect } from 'react';
// Import Redux hooks
// useDispatch: Hook để dispatch actions tới Redux store
// useSelector: Hook để lấy state từ Redux store
import { useDispatch, useSelector } from 'react-redux';
// Import async thunk action từ videoSlice
import { fetchVideos } from '../redux/slices/videoSlice';
// Import Video component để render mỗi video
import Video from '../components/Video';

/**
 * COMPONENT: Videos
 * 
 * MỤC ĐÍCH: Trang hiển thị danh sách tất cả videos
 * 
 * LUỒNG XỬ LÝ:
 * 1. Component mount -> useEffect chạy -> dispatch fetchVideos
 * 2. Redux fetch data từ API
 * 3. Component subscribe state qua useSelector
 * 4. State thay đổi -> Component auto re-render
 * 5. Render danh sách videos hoặc loading/error state
 */
const Videos = () => {
  /**
   * REDUX HOOKS SETUP
   */
  
  // useDispatch(): Lấy dispatch function từ Redux store
  // dispatch: Function để gửi actions tới store
  // Ví dụ: dispatch(fetchVideos()) -> Store nhận action và xử lý
  const dispatch = useDispatch();
  
  // useSelector(): Subscribe Redux state và lấy dữ liệu
  // (state) => state.videos: Selector function - lấy state.videos từ store
  // Destructuring: Lấy videos, loading, error từ state.videos
  // 
  // CÁCH HOẠT ĐỘNG:
  // 1. useSelector subscribe state.videos
  // 2. Mỗi khi state.videos thay đổi -> Component tự động re-render
  // 3. Component nhận values mới (videos, loading, error)
  //
  // STATE STRUCTURE:
  // {
  //   videos: [],      // Mảng videos từ API
  //   loading: false,  // Đang fetch?
  //   error: null      // Lỗi nếu có
  // }
  const { videos, loading, error } = useSelector((state) => state.videos);

  /**
   * USEEFFECT: Fetch videos khi component mount
   * 
   * LUỒNG:
   * 1. Component render lần đầu
   * 2. useEffect chạy sau khi render
   * 3. dispatch(fetchVideos()) được gọi
   * 4. Redux thunk bắt đầu fetch data
   * 
   * DEPENDENCY ARRAY: [dispatch]
   * - Chỉ chạy lại nếu dispatch thay đổi
   * - dispatch không bao giờ thay đổi (stable reference)
   * - Vậy useEffect chỉ chạy 1 lần khi component mount
   */
  useEffect(() => {
    // Dispatch async thunk action
    // fetchVideos là async thunk từ videoSlice.js
    // Redux sẽ:
    // 1. Dispatch pending action (loading = true)
    // 2. Gọi API qua videoAPI.get('/videos')
    // 3. Nếu thành công: Dispatch fulfilled (videos = data, loading = false)
    // 4. Nếu thất bại: Dispatch rejected (error = message, loading = false)
    dispatch(fetchVideos());
  }, [dispatch]); // Dependency array: chỉ chạy khi dispatch thay đổi (không bao giờ)

  /**
   * CONDITIONAL RENDERING: Loading state
   * 
   * KHI NÀO HIỂN THỊ?
   * - Khi loading = true (đang fetch data từ API)
   * 
   * TẠI SAO RETURN SỚM?
   * - Early return pattern
   * - Không render phần còn lại khi đang loading
   * - UI rõ ràng hơn (chỉ hiển thị spinner)
   */
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        {/* 
          SPINNER: Loading indicator
          spinner-border: Bootstrap class cho spinner animation
          text-primary: Màu xanh dương
          role="status": Accessibility (screen reader biết đây là loading state)
        */}
        <div className="spinner-border text-primary" role="status">
          {/* Visually hidden text: Screen reader đọc nhưng không hiển thị */}
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* Loading text cho user */}
        <p className="mt-3">Loading videos...</p>
      </div>
    );
  }

  /**
   * CONDITIONAL RENDERING: Error state
   * 
   * KHI NÀO HIỂN THỊ?
   * - Khi error !== null (API call thất bại)
   * 
   * CÁC TRƯỜNG HỢP LỖI:
   * - Network error: JSON Server không chạy
   * - 404: Endpoint không tồn tại
   * - 500: Server error
   */
  if (error) {
    return (
      <div className="container mt-5">
        {/* 
          ALERT: Error message
          alert alert-danger: Bootstrap alert với màu đỏ (danger)
          role="alert": Accessibility (screen reader đọc ngay lập tức)
        */}
        <div className="alert alert-danger" role="alert">
          {/* Alert heading */}
          <h4 className="alert-heading">Error!</h4>
          {/* Error message từ Redux state */}
          <p>Error loading videos: {error}</p>
          {/* Hướng dẫn user */}
          <p className="mb-0">Please make sure JSON Server is running on port 3001.</p>
        </div>
      </div>
    );
  }

  /**
   * MAIN RENDER: Danh sách videos
   * 
   * KHI NÀO ĐẾN ĐÂY?
   * - loading = false (đã fetch xong)
   * - error = null (không có lỗi)
   * - Có thể có hoặc không có videos (videos.length >= 0)
   */
  return (
    <div className="container mt-4">
      {/* Page title */}
      <h2 className="mb-4">Video Library</h2>
      
      {/* 
        CONDITIONAL: Kiểm tra có videos không
        - Nếu videos.length === 0: Hiển thị "No videos available"
        - Nếu có videos: Render danh sách Video components
      */}
      {videos.length === 0 ? (
        // Empty state: Không có videos
        <div className="alert alert-info" role="alert">
          No videos available.
        </div>
      ) : (
        // 
        // RESPONSIVE GRID: Bootstrap grid system
        // row: Container cho grid items
        //
        // LUỒNG RENDERING:
        // 1. map() tạo một Video component cho mỗi video trong mảng
        // 2. Mỗi Video component nhận prop video={video}
        // 3. PropTypes trong Video.jsx validate prop
        // 4. Video component render iframe, title, description, comments
        //
        <div className="row">
          {/* 
            MAP QUA MẢNG VIDEOS
            - videos: Mảng từ Redux state (đã fetch từ API)
            - map(): Tạo một element mới cho mỗi video
            - key={video.id}: Unique identifier (React requirement)
              * Giúp React identify từng element
              * Cải thiện performance khi re-render
              * Tránh warnings trong console
            
            RESPONSIVE COLUMNS:
            - col-12: Full width trên mobile (< 768px)
            - col-md-6: 2 cột trên tablet (>= 768px)
            - col-lg-4: 3 cột trên desktop (>= 992px)
            
            TẠI SAO RESPONSIVE?
            - Mobile: 1 cột (dễ xem)
            - Tablet: 2 cột (tận dụng không gian)
            - Desktop: 3 cột (tối ưu layout)
          */}
          {videos.map((video) => (
            <div key={video.id} className="col-12 col-md-6 col-lg-4">
              {/* 
                VIDEO COMPONENT
                - video={video}: Pass video object làm prop
                - PropTypes trong Video.jsx sẽ validate prop này
              */}
              <Video video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Export component để sử dụng trong Router
 * 
 * LUỒNG SỬ DỤNG:
 * 1. App.js import: import Videos from './pages/Videos'
 * 2. App.js define route: <Route path="/videos" element={<Videos />} />
 * 3. User truy cập '/videos': Router render Videos component
 * 4. Videos component mount -> useEffect -> dispatch fetchVideos
 * 5. Redux fetch data -> State update -> Component re-render với videos
 */
export default Videos;
