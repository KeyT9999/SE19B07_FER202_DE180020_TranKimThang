import React, { useState } from 'react';
import './App.css';
// BOOTSTRAP CSS IMPORT
// Import Bootstrap CSS để có styling cho tất cả React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
// REACT BOOTSTRAP COMPONENT IMPORTS
import NavBar from './components/NavBar/NavBar';
import FooterPage from './pages/FooterPage';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import AccountPage from './pages/AccountPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'movies':
        return <MoviePage searchQuery={searchQuery} />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  // Navigation handler với search query
  const handleNavigation = (page, query = '') => {
    setCurrentPage(page);
    setSearchQuery(query);
  };

  return (
    <div>
      {/* REACT BOOTSTRAP NAVBAR COMPONENT
          NavBar: Custom navigation component sử dụng React Bootstrap Navbar */}
      <NavBar currentPage={currentPage} onNavigate={handleNavigation} />

      {/* Render Current Page - Các pages này sử dụng React Bootstrap components */}
      {renderPage()}
      
      {/* Footer Component */}
      <FooterPage />
    </div>  
  );
}

export default App;
