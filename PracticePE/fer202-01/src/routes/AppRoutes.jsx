import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PhoneList from "../components/PhoneList";
import ViewPhone from "../components/ViewPhone";
import LoginForm from "../components/LoginForm";
import FavouritePage from "../pages/FavouritePage";
import CartPage from "../pages/CartPage";
import NotFoundPage from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mobiles" element={<PhoneList />} />
      <Route path="/mobiles/:id" element={<ViewPhone />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<div>Register Page - Coming Soon</div>} />
      <Route path="/favourite" element={<FavouritePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}

