# ĐÁNH GIÁ ĐIỂM DỰ ÁN - FER202 PRACTICAL EXAM

## 📊 ĐIỂM HIỆN TẠI: 9.5/10

---

## ✅ CHECKLIST CHI TIẾT

### 1. Project Scaffold (0.5 điểm) ❌ **0/0.5**
**Yêu cầu:**
- [ ] Tạo Vite + React application named `fer202-01`
- [x] Sử dụng React

**Vấn đề:**
- ❌ Project name: `dienthoai` → Cần đổi thành `fer202-01`
- ❌ Đang dùng Create React App (react-scripts) → Cần chuyển sang Vite

**Cách sửa:**
```bash
# Tạo project mới với Vite
npm create vite@latest fer202-01 -- --template react
cd fer202-01
npm install react-router-dom react-bootstrap bootstrap axios prop-types
npm install -D json-server

# Copy code từ dienthoai vào fer202-01
```

---

### 2. Project Structure (1 điểm) ⚠️ **0.5/1**
**Yêu cầu:**
- [x] Folder `components/` ✓
- [x] Folder `pages/` ✓
- [x] Folder `context/` ✓
- [x] Folder `api/` ✓
- [x] Folder `reducers/` ✓
- [ ] Folder `routes/` để centralize router definitions (0.5 điểm)

**Vấn đề:**
- ⚠️ Folder `routes/` tồn tại nhưng rỗng
- ⚠️ Routes được định nghĩa trong `App.js` thay vì centralize

**Cách sửa:**
Tạo `src/routes/AppRoutes.jsx` và move routes vào đó

---

### 3. Mock Data (0.25 điểm) ✅ **0.25/0.25**
- [x] File `db.json` trong project root ✓
- [x] Có `mobiles` array ✓
- [x] Có `accounts` array ✓

---

### 4. Static Assets (0.25 điểm) ✅ **0.25/0.25**
- [x] Folder `public/images/mobiles/` ✓
- [x] Folder `public/images/carousel/` ✓

---

### 5. Navigation (0.5 điểm) ✅ **0.5/0.5**
- [x] NavBar với Home link ✓
- [x] Right-aligned: Favourite ❤️ ✓
- [x] Right-aligned: Cart 🛒 ✓
- [x] Right-aligned: Login 🔐 ✓
- [x] Right-aligned: Register 📝 ✓

---

### 6. Data Display (2 điểm) ✅ **2/2**
- [x] Fetch từ JSON Server ✓
- [x] Hiển thị name ✓
- [x] Hiển thị description ✓
- [x] Hiển thị price ✓
- [x] Hiển thị image ✓

---

### 7. Home Page (2 điểm) ✅ **2/2**
- [x] Main landing page ✓
- [x] Three-image carousel (3 Carousel.Item) ✓
- [x] "Browse mobile shop" button ✓
- [x] Navigate to mobile list ✓

---

### 8. Detail Page (2 điểm) ⚠️ **1.5/2**
**Yêu cầu:**
- [x] View Details button ✓
- [x] Add to Cart button ✓
- [x] Favourite button ✓
- [x] Display full information ✓
- [x] URL contains mobile id (`/mobiles/:id`) ✓
- [x] Back to List button ✓
- [ ] **404 redirect if not found** ❌

**Vấn đề:**
- ❌ Đã xóa NotFoundPage.jsx
- ❌ ViewPhone chỉ hiển thị error message, không redirect đến 404

**Cách sửa:**
Tạo lại NotFoundPage và thêm redirect logic

---

### 9. Login Form (2 điểm) ✅ **2/2**
- [x] Click Login icon opens Login Form ✓
- [x] Validate against accounts from db.json ✓
- [x] Success modal: "Welcome, <username>! Login successful." ✓
- [x] Redirect to mobile list after success ✓
- [x] "Username or Email is required." validation ✓
- [x] "Password is required." validation ✓
- [x] "Invalid username or password!" alert ✓

---

### 10. Technical Requirements ⚠️ **0.5/1**
**Yêu cầu:**
- [x] React Bootstrap styling ✓
- [x] Responsive design ✓
- [ ] **PropTypes validation** ❌ (chỉ có ở ConfirmModal)
- [x] Axios hoặc fetch (đang dùng Axios) ✓
- [x] useReducer ✓
- [x] useContext ✓

**Vấn đề:**
- ❌ Thiếu PropTypes cho: NavBar, PhoneList, ViewPhone, LoginForm, HomePage, CartPage, FavouritePage

---

## 📝 CÁC FILE CẦN SỬA/TẠO

### 1. Tạo NotFoundPage.jsx
```javascript
// src/pages/NotFoundPage.jsx
import React from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">
        <Alert.Heading>404 - Page Not Found</Alert.Heading>
        <p>The page you are looking for does not exist.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
        <Button variant="secondary" onClick={() => navigate("/mobiles")} className="ms-2">
          Back to Mobile List
        </Button>
      </Alert>
    </Container>
  );
}

export default NotFoundPage;
```

### 2. Tạo routes/AppRoutes.jsx
```javascript
// src/routes/AppRoutes.jsx
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
```

### 3. Sửa App.js để dùng routes
```javascript
// src/App.js
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./routes/AppRoutes"; // Import routes

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavouriteProvider>
            <NavBar />
            <AppRoutes /> {/* Sử dụng routes đã centralize */}
          </FavouriteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 4. Sửa ViewPhone.jsx để redirect 404
```javascript
// Trong catch block của ViewPhone.jsx
catch (err) {
  if (err.response && err.response.status === 404) {
    navigate("/404"); // Redirect đến 404 page
    return;
  }
  // ... other error handling
}
```

### 5. Thêm PropTypes cho các components
- NavBar.jsx: PropTypes cho props (nếu có)
- PhoneList.jsx: PropTypes cho props
- ViewPhone.jsx: PropTypes cho props
- LoginForm.jsx: PropTypes cho props
- HomePage.jsx: PropTypes cho props
- CartPage.jsx: PropTypes cho props
- FavouritePage.jsx: PropTypes cho props

---

## 📄 TẠO README.TXT

Tạo file `readme.txt` trong project root:

```
MOBILE SHOP APPLICATION - FER202-01

INSTALLED PACKAGES:
- react: ^19.2.0
- react-dom: ^19.2.0
- react-router-dom: ^7.9.5
- react-bootstrap: ^2.10.10
- bootstrap: ^5.3.8
- axios: ^1.13.2
- prop-types: ^15.8.1
- json-server: (dev dependency)

HOW TO RUN:

1. Install dependencies:
   npm install

2. Start JSON Server (in one terminal):
   json-server --watch db.json --port 3001

3. Start React app (in another terminal):
   npm run dev

4. Open browser:
   http://localhost:3000 (or port shown in terminal)

JSON SERVER ENDPOINTS:
- http://localhost:3001/mobiles
- http://localhost:3001/accounts

NOTES:
- Make sure JSON Server is running before starting React app
- JSON Server must run on port 3001
- React app typically runs on port 3000 or 5173 (Vite)
```

---

## 🎯 TÓM TẮT CẦN SỬA

### Để đạt 10/10 điểm, cần:

1. ✅ **Đổi tên project** → `fer202-01` (0.5 điểm)
2. ✅ **Chuyển sang Vite** từ Create React App (0.5 điểm)
3. ✅ **Centralize routes** vào `routes/AppRoutes.jsx` (0.5 điểm)
4. ✅ **Tạo NotFoundPage** và redirect 404 (0.5 điểm)
5. ✅ **Thêm PropTypes** cho tất cả components (0.5 điểm)
6. ✅ **Tạo readme.txt** với hướng dẫn chạy

---

## ✅ KẾT LUẬN

**ĐIỂM HIỆN TẠI: 9.5/10**

Các tính năng chính đã hoạt động tốt:
- ✅ Login flow hoàn chỉnh
- ✅ Product listing với search/sort
- ✅ Product detail page
- ✅ Cart functionality
- ✅ Favourite functionality
- ✅ Navigation hoạt động tốt

**Chỉ cần sửa các vấn đề về cấu trúc và naming để đạt 10/10!**

---

**Tài liệu này giúp bạn xác định chính xác những gì cần sửa để đạt điểm tối đa.**
