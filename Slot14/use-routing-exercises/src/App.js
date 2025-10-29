import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các component cần thiết
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Navigation from './components/Navigation'; // Thanh điều hướng

// Dashboard components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Settings from './pages/dashboard/Settings';
import Reports from './pages/dashboard/Reports';

function App() {
  return (
    <>
      <Navigation /> {/* Hiển thị thanh điều hướng ở mọi nơi */}
      <div className="container">
        <Routes>
          {/* Route cho trang chủ */}
          <Route path="/" element={<Home />} />
          
          {/* Route cho trang sản phẩm */}
          <Route path="/san-pham" element={<Products />} />
          
          {/* Route động cho trang chi tiết sản phẩm */}
          <Route path="/san-pham/:productId" element={<ProductDetail />} />
          
          {/* Route cho trang liên hệ */}
          <Route path="/lien-he" element={<Contact />} />
          
          {/* Nested Routes cho Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Index route - hiển thị DashboardHome khi vào /dashboard */}
            <Route index element={<DashboardHome />} />
            {/* Child routes */}
            <Route path="settings" element={<Settings />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;