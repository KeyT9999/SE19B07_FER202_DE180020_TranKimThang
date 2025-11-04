// MovieContext: Cung cấp state + hành động (dispatch/hàm CRUD) cho toàn ứng dụng
// Sử dụng React Context + useReducer để quản lý state trung tâm
import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { movieReducer, initialMovieState } from '../reducers/movieReducer';
import movieApi from '../api/MovieAPI';

// Contexts
// Hai Context: một cho state, một cho dispatch + helpers
export const MovieStateContext = createContext(initialMovieState); 
export const MovieDispatchContext = createContext(null);          

// Custom Hooks
// Custom hooks để lấy state/dispatch từ Context (giúp code gọn ở component)
export const useMovieState = () => useContext(MovieStateContext);
export const useMovieDispatch = () => useContext(MovieDispatchContext);

// MovieProvider Component
export const MovieProvider = ({ children }) => {
  // Khởi tạo reducer với state ban đầu
  const [state, dispatch] = useReducer(movieReducer, initialMovieState);

  // Hàm READ: Tải lại dữ liệu (Axios GET)
  // Tải danh sách phim từ API
  const fetchMovies = useCallback(async () => {
    dispatch({ type: 'START_LOADING' });
    try {
      const response = await movieApi.get('/movies');
      dispatch({ type: 'SET_MOVIES', payload: response.data });
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
      // Giữ state cũ nếu lỗi (hoặc [] nếu ban đầu chưa có)
      dispatch({ type: 'SET_MOVIES', payload: [] }); 
    }
  }, []);

  // Hàm fetch genres từ API
  // Tải danh sách thể loại từ API
  const fetchGenres = useCallback(async () => {
    try {
      const response = await movieApi.get('/genres');
      dispatch({ type: 'SET_GENRES', payload: response.data });
    } catch (error) {
      console.error("Lỗi khi tải danh sách thể loại:", error);
      dispatch({ type: 'SET_GENRES', payload: [] });
    }
  }, []); 
  
  // Hàm DELETE: Xóa phim (Axios DELETE)
  const confirmDelete = useCallback(async (id) => {
    dispatch({ type: 'CLOSE_DELETE_MODAL' });
    dispatch({ type: 'START_LOADING' });

    try {
      await movieApi.delete(`/movies/${id}`);
      fetchMovies(); // Tải lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      fetchMovies(); // Reload to get current state from server
    }
  }, [fetchMovies]);

  // Hàm CREATE/UPDATE: Xử lý POST và PUT (Axios POST/PUT)
  // Hàm CREATE/UPDATE: Gửi request POST hoặc PUT tùy theo trạng thái đang sửa hay thêm mới
  const handleCreateOrUpdate = useCallback(async (dataToSend, isEditing, isEditingId) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      if (isEditing) {
        // UPDATE (PUT)
        await movieApi.put(`/movies/${isEditingId}`, dataToSend);
      } else {
        // CREATE (POST)
        await movieApi.post('/movies', dataToSend);
      }
      
      dispatch({ type: 'RESET_FORM' }); 
      fetchMovies(); 
      return true;
    } catch (error) {
      console.error("Lỗi thao tác CREATE/UPDATE:", error);
      fetchMovies(); // Reload to get current state from server
      return false;
    }
  }, [fetchMovies]);

  // Khi Provider mount lần đầu: tải movies + genres
  useEffect(() => {
    fetchMovies();
    fetchGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Giá trị của Dispatch Context
  // Gom tất cả hành động để truyền qua Dispatch Context
  const dispatchValue = {
      dispatch, 
      fetchMovies,
      fetchGenres,
      confirmDelete,
      handleCreateOrUpdate 
  };

  return (
    <MovieStateContext.Provider value={state}>
      <MovieDispatchContext.Provider value={dispatchValue}>
        {children}
      </MovieDispatchContext.Provider>
    </MovieStateContext.Provider>
  );
};

