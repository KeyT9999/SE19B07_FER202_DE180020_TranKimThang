import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider} from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";

// Import Components
import NavBar from "./components/NavBar";

// Import Pages
import HomePage from "./pages/HomePage";
import CameraList from "./components/CameraList";
import ViewCamera from "./components/ViewCamera";
import LoginForm from "./components/LoginForm";
import FavouritePage from "./pages/FavouritePage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavouriteProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cameras" element={<CameraList />} />
              <Route path="/cameras/:id" element={<ViewCamera />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<div>Register Page - Coming Soon</div>} />
              <Route path="/favourite" element={<FavouritePage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </FavouriteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
