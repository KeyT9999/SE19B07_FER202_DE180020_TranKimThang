import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';
import MovieLayout from './components/MovieLayout';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import MovieManager from './pages/MovieManager';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // BrowserRouter wraps the app so we can navigate between login and movie pages.
  return (
    <BrowserRouter>
      {/* AuthProvider keeps track of the signed-in account across the entire app. */}
      <AuthProvider>
        <div className="App">
          {/* Header stays immutable so it can show user info or login link on every page. */}
          <AppHeader />
          <Routes>
            {/* Public login page – redirect target when user is unauthenticated. */}
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MovieLayout />}>
                {/* Movie area only renders when ProtectedRoute confirms the user is signed in. */}
                <Route path="/movies" element={<MovieManager />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/movies" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
