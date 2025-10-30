import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { initialMovieState, movieReducer } from '../reducers/movieReducers';
import movieApi from '../api/movieApi';

// Expose two contexts: one for reading movie state, one for calling actions.
export const MovieStateContext = createContext(initialMovieState);
export const MovieDispatchContext = createContext(null);

export const useMovieState = () => useContext(MovieStateContext);
export const useMovieDispatch = () => useContext(MovieDispatchContext);

export const MovieProvider = ({ children }) => {
  // Reducer centralises every change to movie-related state (movies, form, filters, modals).
  const [state, dispatch] = useReducer(movieReducer, initialMovieState);

  // Load movies from json-server and push them into the reducer.
  const fetchMovies = useCallback(async () => {
    dispatch({ type: 'START_LOADING' });
    try {
      const response = await movieApi.get('/movies');
      dispatch({ type: 'SET_MOVIES', payload: response.data });
    } catch (error) {
      console.error('Lỗi khi tải danh sách phim:', error);
      dispatch({ type: 'SET_MOVIES', payload: [] });
    }
  }, []);

  // Fetch list of genres so the form and filter drop-downs stay dynamic.
  const fetchGenres = useCallback(async () => {
    try {
      const response = await movieApi.get('/genres');
      dispatch({ type: 'SET_GENRES', payload: response.data });
    } catch (error) {
      console.error('Lỗi khi tải danh sách thể loại:', error);
      dispatch({ type: 'SET_GENRES', payload: [] });
    }
  }, []);

  // Delete confirmation flows through here so we can refresh data after the server call.
  const confirmDelete = useCallback(
    async id => {
      dispatch({ type: 'CLOSE_DELETE_MODAL' });
      dispatch({ type: 'START_LOADING' });
      try {
        await movieApi.delete(`/movies/${id}`);
        fetchMovies();
      } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
        fetchMovies();
      }
    },
    [fetchMovies]
  );

  // Shared create & update handler – decides between POST and PUT, then reloads the list.
  const handleCreateOrUpdate = useCallback(
    async (dataToSend, isEditing, isEditingId) => {
      dispatch({ type: 'START_LOADING' });
      try {
        if (isEditing) {
          await movieApi.put(`/movies/${isEditingId}`, dataToSend);
        } else {
          await movieApi.post('/movies', dataToSend);
        }
        dispatch({ type: 'RESET_FORM' });
        fetchMovies();
        return true;
      } catch (error) {
        console.error('Lỗi thao tác CREATE/UPDATE:', error);
        fetchMovies();
        return false;
      }
    },
    [fetchMovies]
  );

  // Update filter criteria whenever the user interacts with FilterBar.
  const updateFilters = useCallback(changes => {
    dispatch({ type: 'SET_FILTERS', payload: changes });
  }, []);

  // Restore the filter defaults (used by the "reset filters" button).
  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // Initial load – hydrate movies and genres as soon as the provider mounts.
  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [fetchMovies, fetchGenres]);

  const dispatchValue = {
    dispatch, // Expose raw dispatch in case components need bespoke actions.
    fetchMovies,
    fetchGenres,
    confirmDelete,
    handleCreateOrUpdate,
    updateFilters,
    resetFilters
  };

  return (
    <MovieStateContext.Provider value={state}>
      <MovieDispatchContext.Provider value={dispatchValue}>
        {children}
      </MovieDispatchContext.Provider>
    </MovieStateContext.Provider>
  );
};
