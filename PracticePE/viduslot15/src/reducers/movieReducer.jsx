// initialMovieState: Trạng thái khởi tạo cho toàn bộ nghiệp vụ Movie
// - movies: danh sách phim
// - genres: danh sách thể loại
// - currentMovie: dữ liệu đang nhập/sửa trong form
// - isEditing: id của phim đang sửa (null = đang thêm mới)
// - showEditModal/showDeleteModal: điều khiển mở/đóng modal
export const initialMovieState = {
  movies: [],
  genres: [],
  loading: false, 
  isEditing: null, 
  currentMovie: { avatar: '', title: '', description: '', genreId: '', duration: '', year: '', country: '' },
  showEditModal: false,   
  showDeleteModal: false, 
  movieToDelete: null     
};

// movieReducer: Hàm reducer thuần (pure function) nhận state + action -> trả về state mới
// Các action.type được dispatch từ UI/Context sẽ cập nhật state tương ứng
export const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };

    case 'SET_GENRES':
      return { ...state, genres: action.payload };
      
    case 'START_LOADING':
      return { ...state, loading: true };
      
    case 'UPDATE_FIELD':
      // Cập nhật một trường trong currentMovie dựa trên name/value từ input
      return { 
          ...state, 
          currentMovie: { ...state.currentMovie, [action.payload.name]: action.payload.value }
      };

    case 'OPEN_EDIT_MODAL':
      // Gán dữ liệu phim vào currentMovie để điền vào form sửa và mở modal
      return { 
        ...state, 
        currentMovie: action.payload, 
        isEditing: action.payload.id,
        showEditModal: true 
      };
      
    case 'CLOSE_EDIT_MODAL':
      // Đóng modal sửa và reset currentMovie
      return { 
        ...state, 
        currentMovie: initialMovieState.currentMovie,
        isEditing: null,
        showEditModal: false 
      };

    case 'OPEN_DELETE_MODAL':
        // Mở modal xóa và lưu phim sắp xóa
        return {
            ...state,
            movieToDelete: action.payload,
            showDeleteModal: true 
        };

    case 'CLOSE_DELETE_MODAL':
        // Đóng modal xóa và xóa chọn
        return {
            ...state,
            movieToDelete: null,
            showDeleteModal: false 
        };
      
    case 'RESET_FORM':
      // Reset form về mặc định sau khi tạo/sửa thành công
      return { 
        ...state, 
        currentMovie: initialMovieState.currentMovie, 
        isEditing: null,
        showEditModal: false,
      };

    default:
      // Nếu action không khớp, trả về state hiện tại (bắt buộc trong reducer)
      return state;
  }
};

