/**
 * FILE: Video.jsx
 * MỤC ĐÍCH: Component hiển thị thông tin một video (iframe embed, title, description, comments)
 * VỊ TRÍ: src/components/Video.jsx
 * 
 * LUỒNG SỬ DỤNG:
 * 1. Trang Videos.jsx fetch danh sách videos từ Redux
 * 2. Videos.jsx map qua mảng videos, render component Video cho mỗi video
 * 3. Video component nhận prop 'video' chứa thông tin video
 * 4. Component render iframe (YouTube embed), title, description, comments
 * 
 * TẠI SAO TÁCH THÀNH COMPONENT RIÊNG?
 * - Tái sử dụng: Dùng lại cho nhiều video
 * - Dễ bảo trì: Sửa UI video ở 1 chỗ, áp dụng cho tất cả
 * - Dễ test: Test riêng component này
 * - Đúng nguyên tắc Single Responsibility (mỗi component 1 nhiệm vụ)
 */

// Import React - cần thiết cho JSX và hooks
import React from 'react';
// Import PropTypes để validate props (YÊU CẦU ĐỀ BÀI - 2 điểm)
import PropTypes from 'prop-types';

/**
 * COMPONENT: Video
 * 
 * NHẬN PROPS:
 * @param {Object} video - Object chứa thông tin video
 * @param {string} video.title - Tiêu đề video (bắt buộc)
 * @param {string} video.description - Mô tả video (bắt buộc)
 * @param {string} video.url - URL embed của video YouTube (bắt buộc)
 * @param {Array} video.comments - Mảng comments (bắt buộc)
 * @param {Object} video.comments[].user - Tên người comment (bắt buộc)
 * @param {string} video.comments[].text - Nội dung comment (bắt buộc)
 * 
 * RETURN: JSX element hiển thị video card
 */
const Video = ({ video }) => {
  /**
   * RETURN: JSX hiển thị video card
   * 
   * CẤU TRÚC:
   * - Card container (Bootstrap class)
   * - Responsive iframe wrapper (YouTube embed)
   * - Card body: title, description, comments list
   */
  return (
    // Card container với Bootstrap classes
    // mb-4: margin-bottom 4 units (khoảng cách giữa các cards)
    // shadow-sm: Shadow nhẹ (tạo độ sâu cho card)
    <div className="card mb-4 shadow-sm">
      {/* 
        RESPONSIVE IFRAME WRAPPER
        TẠI SAO CẦN WRAPPER?
        - iframe mặc định không responsive (cố định width/height)
        - Cần container với padding-bottom trick để tạo responsive aspect ratio
        
        CÁCH HOẠT ĐỘNG:
        - paddingBottom: 56.25% = tỷ lệ 16:9 (9/16 = 0.5625 = 56.25%)
        - height: 0 để container không có chiều cao thực
        - overflow: hidden để ẩn phần iframe dư thừa
        - iframe absolute để lấp đầy container
      */}
      <div style={{ 
        position: 'relative',    // Relative để iframe absolute căn theo
        paddingBottom: '56.25%', // Tỷ lệ 16:9 (width:height)
        height: 0,               // Không có chiều cao thực
        overflow: 'hidden'       // Ẩn phần dư thừa
      }}>
        {/* 
          IFRAME EMBED: YouTube video player
          YÊU CẦU ĐỀ BÀI: Embed video bằng iframe (3 điểm)
          
          CÁC THUỘC TÍNH:
          - width="560", height="315": Kích thước chuẩn YouTube (16:9)
          - src: URL embed từ video.url (từ props)
          - title: Mô tả cho screen readers (accessibility)
          - frameBorder="0": Bỏ viền iframe
          - allow: Các tính năng được phép (autoplay, fullscreen, etc.)
          - allowFullScreen: Cho phép fullscreen
          - style: Position absolute để lấp đầy container (responsive)
        */}
        <iframe
          width="560"
          height="315"
          src={video.url}  // URL embed từ prop (ví dụ: https://www.youtube.com/embed/...)
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ 
            position: 'absolute', // Absolute để căn theo container
            top: 0,              // Căn trên cùng
            left: 0,             // Căn bên trái
            width: '100%',       // Chiếm 100% width của container
            height: '100%'       // Chiếm 100% height của container
          }}
        ></iframe>
      </div>
      
      {/* Card body: Chứa thông tin video */}
      <div className="card-body">
        {/* Title: Tiêu đề video (Bootstrap class: card-title) */}
        <h5 className="card-title">{video.title}</h5>
        
        {/* Description: Mô tả video (Bootstrap class: card-text) */}
        <p className="card-text">{video.description}</p>
        
        {/* Comments section */}
        <h6>Comments:</h6>
        
        {/* 
          CONDITIONAL RENDERING: Hiển thị comments hoặc "No comments"
          
          LUỒNG:
          1. Kiểm tra video.comments.length > 0
          2a. Nếu có comments: Render danh sách comments
          2b. Nếu không có: Hiển thị "No comments yet"
          
          TẠI SAO DÙNG MAP?
          - video.comments là mảng
          - map() tạo một element mới cho mỗi comment
          - key={comment.id} để React identify từng element (cần cho performance)
        */}
        {video.comments.length > 0 ? (
          // Danh sách comments (Bootstrap list-group)
          <ul className="list-group list-group-flush">
            {/* 
              MAP QUA MẢNG COMMENTS
              - Mỗi comment là một object: { id, user, text }
              - Tạo <li> cho mỗi comment
              - key={comment.id}: Unique identifier (React yêu cầu)
            */}
            {video.comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                {/* 
                  Hiển thị user và text
                  <strong>: In đậm tên user (Bootstrap class)
                */}
                <strong>{comment.user}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          // Hiển thị khi không có comments
          // text-muted: Màu xám nhạt (Bootstrap class)
          <p className="text-muted">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

/**
 * PROP TYPES VALIDATION
 * YÊU CẦU ĐỀ BÀI: PropTypes validation đầy đủ (2 điểm)
 * 
 * TẠI SAO DÙNG PROP TYPES?
 * - Kiểm tra kiểu dữ liệu props trong development
 * - Cảnh báo nếu props không đúng format
 * - Tự động hóa documentation
 * - Phát hiện lỗi sớm (trước khi runtime)
 * 
 * LUỒNG VALIDATION:
 * 1. Component nhận props từ parent
 * 2. PropTypes kiểm tra props có đúng format không
 * 3. Nếu sai: Hiển thị warning trong console (chỉ development)
 * 4. Nếu đúng: Component render bình thường
 */
Video.propTypes = {
  // video: Object bắt buộc (isRequired)
  // PropTypes.shape(): Kiểm tra shape (cấu trúc) của object
  video: PropTypes.shape({
    // title: String bắt buộc
    // Kiểm tra: video.title phải là string và không được undefined/null
    title: PropTypes.string.isRequired,
    
    // description: String bắt buộc
    // Kiểm tra: video.description phải là string và không được undefined/null
    description: PropTypes.string.isRequired,
    
    // url: String bắt buộc
    // Kiểm tra: video.url phải là string và không được undefined/null
    url: PropTypes.string.isRequired,
    
    // comments: Array bắt buộc
    // PropTypes.arrayOf(): Kiểm tra mỗi phần tử trong array
    // PropTypes.shape(): Kiểm tra shape của mỗi comment object
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        // user: String bắt buộc trong mỗi comment
        // Kiểm tra: comment.user phải là string và không được undefined/null
        user: PropTypes.string.isRequired,
        
        // text: String bắt buộc trong mỗi comment
        // Kiểm tra: comment.text phải là string và không được undefined/null
        text: PropTypes.string.isRequired,
      })
    ).isRequired,  // comments array cũng bắt buộc (không được undefined/null)
  }).isRequired,  // video prop cũng bắt buộc (không được undefined/null)
};

/**
 * Export component để sử dụng ở nơi khác
 * 
 * LUỒNG SỬ DỤNG:
 * 1. Videos.jsx import: import Video from '../components/Video'
 * 2. Videos.jsx render: <Video video={video} />
 * 3. PropTypes tự động validate video prop
 */
export default Video;
