// src/reducers/movieReducers.jsx

// Factory keeps the "blank movie" shape consistent across form reset paths.
const createEmptyMovie = () => ({
  avatar: '',
  title: '',
  description: '',
  genreId: '',
  duration: '',
  year: '',
  country: ''
});

// Every bit of movie related state lives here so the reducer can manage it atomically.
export const initialMovieState = {
  movies: [],
  genres: [],
  loading: false,
  isEditing: null,
  currentMovie: createEmptyMovie(),
  showEditModal: false,
  showDeleteModal: false,
  movieToDelete: null,
  filters: {
    search: '',
    genreId: '',
    duration: '',
    sort: 'title-asc'
  }
};

export const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      // Loaded movies replace the list and clear the loading indicator.
      return { ...state, movies: action.payload, loading: false };

    case 'SET_GENRES':
      return { ...state, genres: action.payload };

    case 'START_LOADING':
      return { ...state, loading: true };

    case 'UPDATE_FIELD':
      // Sync input changes into the form state.
      return {
        ...state,
        currentMovie: { ...state.currentMovie, [action.payload.name]: action.payload.value }
      };

    case 'OPEN_EDIT_MODAL':
      // Populate the form with the target movie and show the edit dialog.
      return {
        ...state,
        currentMovie: { ...action.payload },
        isEditing: action.payload.id,
        showEditModal: true
      };

    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        currentMovie: createEmptyMovie(),
        isEditing: null,
        showEditModal: false
      };

    case 'OPEN_DELETE_MODAL':
      // Remember the movie we plan to delete so the modal can render details.
      return {
        ...state,
        movieToDelete: action.payload,
        showDeleteModal: true
      };

    case 'CLOSE_DELETE_MODAL':
      return {
        ...state,
        movieToDelete: null,
        showDeleteModal: false
      };

    case 'RESET_FORM':
      // Clear form inputs after a successful create/update.
      return {
        ...state,
        currentMovie: createEmptyMovie(),
        isEditing: null,
        showEditModal: false
      };

    case 'SET_FILTERS':
      // Merge incoming filter changes with the current criteria.
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { ...initialMovieState.filters }
      };

    default:
      return state;
  }
};
