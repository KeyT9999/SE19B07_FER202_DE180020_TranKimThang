# Mobile Shop Application - Hướng Dẫn Chi Tiết

## 📋 Mục Lục
1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Cài Đặt và Chạy Dự Án](#cài-đặt-và-chạy-dự-án)
4. [Luồng Đăng Nhập (Login Flow)](#luồng-đăng-nhập-login-flow)
5. [Luồng Hiển Thị Sản Phẩm](#luồng-hiển-thị-sản-phẩm)
6. [Luồng Giỏ Hàng (Cart)](#luồng-giỏ-hàng-cart)
7. [Luồng Favourite](#luồng-favourite)
8. [Các File Quan Trọng và Giải Thích](#các-file-quan-trọng-và-giải-thích)

---

## 📦 Tổng Quan Dự Án

Dự án **Mobile Shop** là một ứng dụng quản lý cửa hàng điện thoại di động được xây dựng bằng:
- **ReactJS** với Vite
- **React Router** cho navigation
- **React Bootstrap** cho UI
- **JSON Server** làm mock API
- **Context API + useReducer** cho state management
- **Axios** cho HTTP requests

---

## 📁 Cấu Trúc Thư Mục

```
dienthoai/
├── public/
│   └── images/
│       ├── mobiles/          # Ảnh sản phẩm điện thoại
│       └── carousel/          # Ảnh carousel cho trang chủ
├── src/
│   ├── api/
│   │   └── PhoneAPI.js       # Cấu hình Axios instance
│   ├── components/
│   │   ├── NavBar.jsx        # Thanh điều hướng
│   │   ├── PhoneList.jsx     # Danh sách sản phẩm
│   │   ├── ViewPhone.jsx     # Chi tiết sản phẩm
│   │   ├── LoginForm.jsx     # Form đăng nhập
│   │   └── ConfirmModal.jsx  # Modal xác nhận
│   ├── context/
│   │   ├── AuthContext.jsx   # Quản lý authentication
│   │   ├── CartContext.jsx   # Quản lý giỏ hàng
│   │   └── FavouriteContext.jsx # Quản lý yêu thích
│   ├── pages/
│   │   ├── HomePage.jsx      # Trang chủ
│   │   ├── CartPage.jsx      # Trang giỏ hàng
│   │   └── FavouritePage.jsx # Trang yêu thích
│   ├── reducers/
│   │   ├── AuthReducer.jsx   # Reducer cho authentication
│   │   └── LoginFormReducer.jsx # Reducer cho form login
│   ├── App.js                # Component chính, định nghĩa routes
│   └── main.jsx              # Entry point
├── db.json                   # Mock database cho JSON Server
└── package.json              # Dependencies và scripts
```

---

## 🚀 Cài Đặt và Chạy Dự Án

### Bước 1: Cài đặt Dependencies
```bash
cd dienthoai
npm install
```

### Bước 2: Khởi động JSON Server
Mở terminal mới và chạy:
```bash
cd dienthoai
json-server --watch db.json --port 3001
```

JSON Server sẽ chạy tại: `http://localhost:3001`
- Endpoints: `/mobiles`, `/accounts`

### Bước 3: Khởi động React App
Mở terminal khác và chạy:
```bash
cd dienthoai
npm run dev
```

React App sẽ chạy tại: `http://localhost:3000` (hoặc port khác)

---

## 🔐 Luồng Đăng Nhập (Login Flow)

### Sơ Đồ Luồng:
```
User nhập thông tin → LoginForm → Validation → AuthContext.login() 
→ AuthReducer → Set user state → Show success modal → Navigate to /mobiles
```

### Các File Liên Quan:
1. **LoginForm.jsx** - Component form đăng nhập
2. **AuthContext.jsx** - Quản lý state authentication
3. **AuthReducer.jsx** - Xử lý các action authentication
4. **LoginFormReducer.jsx** - Quản lý state của form

### Chi Tiết Luồng:

#### 1. User Nhập Thông Tin (`LoginForm.jsx`)

```javascript
// Khi user nhập vào input
const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Dispatch action SET_FIELD để cập nhật giá trị field
  dispatch({ type: "SET_FIELD", field: name, value });
  
  // Validation real-time
  if (name === "identifier") {
    if (!value.trim()) {
      dispatch({ type: "SET_ERROR", field: "identifier", error: "Username or Email is required." });
    } else {
      dispatch({ type: "CLEAR_ERROR", field: "identifier" });
    }
  }
  
  if (name === "password") {
    if (!value.trim()) {
      dispatch({ type: "SET_ERROR", field: "password", error: "Password is required." });
    } else {
      dispatch({ type: "CLEAR_ERROR", field: "password" });
    }
  }
  
  // Clear error từ AuthContext khi user bắt đầu nhập
  clearError();
};
```

#### 2. User Submit Form (`LoginForm.jsx`)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault(); // Ngăn form submit mặc định
  
  // Validate form
  let isValid = true;
  
  if (!formState.identifier.trim()) {
    dispatch({ type: "SET_ERROR", field: "identifier", error: "Username or Email is required." });
    isValid = false;
  }
  
  if (!formState.password.trim()) {
    dispatch({ type: "SET_ERROR", field: "password", error: "Password is required." });
    isValid = false;
  }
  
  if (!isValid) return; // Dừng nếu validation thất bại
  
  // Gọi login() từ AuthContext
  const result = await login(formState.identifier, formState.password);
  
  if (result.ok) {
    // Login thành công → hiển thị modal
    dispatch({ type: "SHOW_SUCCESS_MODAL" });
    
    // Sau 2 giây → redirect đến /mobiles
    setTimeout(() => {
      dispatch({ type: "HIDE_SUCCESS_MODAL" });
      navigate("/mobiles");
    }, 2000);
  }
  // Nếu thất bại → error từ AuthContext sẽ được hiển thị tự động
};
```

#### 3. AuthContext Xử Lý Login (`AuthContext.jsx`)

```javascript
function login(identifier, password) {
  // Dispatch LOGIN_START → set loading = true, error = null
  dispatch({ type: "LOGIN_START" });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Kiểm tra identifier là email hay username
      const isEmail = identifier.includes("@");
      
      // Tìm user trong danh sách users khớp với identifier và password
      const account = state.users.find((acc) =>
        isEmail
          ? acc.email === identifier && acc.password === password
          : acc.username === identifier && acc.password === password
      );
      
      if (!account) {
        // Không tìm thấy → dispatch LOGIN_FAILURE
        dispatch({ type: "LOGIN_FAILURE", payload: "Invalid username or password!" });
        resolve({ ok: false });
        return;
      }
      
      // Kiểm tra account có bị khóa không
      if (account.status === "locked") {
        dispatch({ type: "LOGIN_FAILURE", payload: "Account locked." });
        resolve({ ok: false });
        return;
      }
      
      // Hợp lệ → dispatch LOGIN_SUCCESS
      dispatch({ type: "LOGIN_SUCCESS", payload: account });
      resolve({ ok: true, account });
    }, 1000); // Delay 1 giây để mô phỏng API call
  });
}
```

#### 4. AuthReducer Xử Lý Actions (`AuthReducer.jsx`)

```javascript
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      // Bắt đầu login → set loading = true, error = null
      return { ...state, loading: true, error: null };
    
    case "LOGIN_SUCCESS":
      // Login thành công → lưu user, set isAuthenticated = true
      return {
        ...state,
        user: action.payload,      // Lưu thông tin user đã đăng nhập
        loading: false,
        isAuthenticated: true,      // Đánh dấu đã đăng nhập
      };
    
    case "LOGIN_FAILURE":
      // Login thất bại → lưu error message
      return {
        ...state,
        loading: false,
        error: action.payload,      // Lưu thông báo lỗi
        isAuthenticated: false,
      };
    
    case "LOGOUT":
      // Đăng xuất → reset về trạng thái chưa đăng nhập
      return { ...state, user: null, isAuthenticated: false };
    
    default:
      return state;
  }
};
```

#### 5. Hiển Thị Kết Quả (`LoginForm.jsx`)

```javascript
// Hiển thị error từ AuthContext nếu có
{error && (
  <Alert variant="danger" onClose={clearError} dismissible>
    {error}
  </Alert>
)}

// Hiển thị modal thành công
<ConfirmModal
  show={formState.showSuccessModal}
  title="Login Successful"
  message={`Welcome, ${user?.username}! Login successful.`}
/>
```

---

## 📱 Luồng Hiển Thị Sản Phẩm

### Sơ Đồ Luồng:
```
App.js (Route) → PhoneList → Fetch từ API → Hiển thị danh sách
→ User click "View Details" → ViewPhone → Fetch chi tiết → Hiển thị
```

### Chi Tiết:

#### 1. Route Định Nghĩa (`App.js`)

```javascript
<Routes>
  <Route path="/mobiles" element={<PhoneList />} />
  <Route path="/mobiles/:id" element={<ViewPhone />} />
</Routes>
```

#### 2. PhoneList Fetch Danh Sách (`PhoneList.jsx`)

```javascript
useEffect(() => {
  const fetchMobiles = async () => {
    try {
      setLoading(true);
      // Gọi API GET /mobiles
      const response = await PhoneAPI.get("/mobiles");
      
      // Lưu vào state
      setMobiles(response.data);
      setFilteredMobiles(response.data);
      setError(null);
    } catch (err) {
      setError(`Không thể tải danh sách mobiles...`);
    } finally {
      setLoading(false);
    }
  };
  
  fetchMobiles(); // Chạy khi component mount
}, []); // Chỉ chạy 1 lần khi mount
```

#### 3. Filter và Sort (`PhoneList.jsx`)

```javascript
useEffect(() => {
  let filtered = [...mobiles];
  
  // Tìm kiếm theo tên
  if (searchTerm) {
    filtered = filtered.filter((mobile) =>
      mobile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Sắp xếp
  if (sortOrder === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "price-asc") {
    filtered.sort((a, b) => {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(...);
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(...);
      return priceA - priceB;
    });
  }
  
  setFilteredMobiles(filtered);
}, [searchTerm, sortOrder, mobiles]); // Chạy lại khi các giá trị này thay đổi
```

#### 4. ViewPhone Fetch Chi Tiết (`ViewPhone.jsx`)

```javascript
useEffect(() => {
  const fetchMobile = async () => {
    if (!id) {
      setError("No mobile ID provided.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Lấy ID từ URL params
      const { id } = useParams(); // Ví dụ: /mobiles/1 → id = "1"
      
      // Gọi API GET /mobiles/:id
      const response = await PhoneAPI.get(`/mobiles/${id}`);
      
      if (response.data) {
        setMobile(response.data); // Lưu thông tin mobile vào state
      } else {
        setError("Mobile data is empty");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Mobile with ID ${id} not found...`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  fetchMobile();
}, [id]); // Chạy lại khi id thay đổi
```

---

## 🛒 Luồng Giỏ Hàng (Cart)

### Sơ Đồ Luồng:
```
User click "Add to Cart" → CartContext.addToCart() → CartReducer 
→ Update state → CartPage hiển thị → User có thể update quantity/remove
```

### Chi Tiết:

#### 1. CartContext (`CartContext.jsx`)

```javascript
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      // Tìm xem item đã có trong giỏ hàng chưa
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        // Đã có → tăng quantity lên 1
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      // Chưa có → thêm mới với quantity = 1
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    
    case "UPDATE_QUANTITY":
      // Cập nhật số lượng của item
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case "REMOVE_FROM_CART":
      // Xóa item khỏi giỏ hàng
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    
    default:
      return state;
  }
};
```

#### 2. Sử Dụng trong Component (`PhoneList.jsx`)

```javascript
const { addToCart } = useCart(); // Lấy function từ CartContext

const handleAddToCart = (mobile) => {
  addToCart(mobile); // Thêm vào giỏ hàng
  setSuccessMessage(`${mobile.name} has been added to your cart.`);
  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
};
```

#### 3. CartPage Hiển Thị (`CartPage.jsx`)

```javascript
const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

// Hiển thị danh sách items trong bảng
{items.map((item) => (
  <tr key={item.id}>
    <td>{item.name}</td>
    <td>{formatPrice(item.price)}</td>
    <td>
      {/* Input để thay đổi quantity */}
      <Button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>
        -
      </Button>
      <Form.Control
        type="number"
        value={item.quantity}
        onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value))}
      />
      <Button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>
        +
      </Button>
    </td>
    <td>{formatPrice(getSubtotal(item))}</td>
    <td>
      <Button onClick={() => handleRemoveFromCart(item)}>Remove</Button>
    </td>
  </tr>
))}

// Hiển thị tổng tiền
<strong>Total: {formatPrice(getTotalPrice())}</strong>
```

---

## ❤️ Luồng Favourite

### Sơ Đồ Luồng:
```
User click "Favourite" → FavouriteContext.addToFavourite() 
→ FavouriteReducer → Update state → FavouritePage hiển thị
```

### Chi Tiết:

#### 1. FavouriteContext (`FavouriteContext.jsx`)

```javascript
const favouriteReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVOURITE":
      // Kiểm tra đã có trong favourites chưa
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        // Đã có → không làm gì
        return state;
      }
      
      // Chưa có → thêm mới
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    
    case "REMOVE_FROM_FAVOURITE":
      // Xóa khỏi favourites
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    
    default:
      return state;
  }
};
```

#### 2. Sử Dụng trong Component (`PhoneList.jsx`)

```javascript
const { addToFavourite, isFavourite } = useFavourite();

const handleFavourite = (mobile) => {
  if (isFavourite(mobile.id)) {
    setSuccessMessage(`${mobile.name} is already in your favourites.`);
  } else {
    addToFavourite(mobile);
    setSuccessMessage(`${mobile.name} has been added to your favourites.`);
  }
  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
};

// Hiển thị button với trạng thái
<Button onClick={() => handleFavourite(mobile)}>
  {isFavourite(mobile.id) ? "❤️ Favourited" : "❤️ Favourite"}
</Button>
```

---

## 📄 Các File Quan Trọng và Giải Thích

### 1. App.js - Định Nghĩa Routes và Providers

```javascript
function App() {
  return (
    <BrowserRouter>
      {/* Wrap toàn bộ app với các Context Providers */}
      <AuthProvider>      {/* Quản lý authentication */}
        <CartProvider>    {/* Quản lý giỏ hàng */}
          <FavouriteProvider> {/* Quản lý favourites */}
            <NavBar />    {/* Hiển thị trên mọi trang */}
            
            {/* Định nghĩa các routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mobiles" element={<PhoneList />} />
              <Route path="/mobiles/:id" element={<ViewPhone />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/favourite" element={<FavouritePage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </FavouriteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 2. PhoneAPI.js - Cấu Hình Axios

```javascript
import axios from "axios";

// Tạo Axios instance với cấu hình mặc định
const PhoneApi = axios.create({
  baseURL: "http://localhost:3001",  // Base URL của JSON Server
  timeout: 5000,                      // Timeout 5 giây
  headers: {
    "Content-Type": "application/json", // Header mặc định
  },
});

export default PhoneApi;
```

### 3. NavBar.jsx - Hiển Thị Username Khi Đăng Nhập

```javascript
const { user, isAuthenticated, logout } = useAuth();

// Hiển thị khác nhau tùy vào trạng thái đăng nhập
{isAuthenticated && user ? (
  <NavDropdown title={`👤 ${user.username}`}>
    <NavDropdown.Item disabled>
      <small>{user.email}</small>
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <NavDropdown.Item onClick={handleLogout}>
      🚪 Logout
    </NavDropdown.Item>
  </NavDropdown>
) : (
  <>
    <Nav.Link onClick={() => navigate("/login")}>🔐 Login</Nav.Link>
    <Nav.Link onClick={() => navigate("/register")}>📝 Register</Nav.Link>
  </>
)}
```

---

## 🎯 Các Bước Hoàn Thành Dự Án

### Bước 1: Setup Project
1. Tạo Vite + React project: `npm create vite@latest dienthoai -- --template react`
2. Cài đặt dependencies:
   ```bash
   npm install react-router-dom react-bootstrap bootstrap axios prop-types
   npm install -D json-server
   ```

### Bước 2: Tạo Cấu Trúc Thư Mục
1. Tạo các thư mục: `api`, `components`, `context`, `pages`, `reducers`
2. Tạo file `db.json` với dữ liệu mẫu

### Bước 3: Setup JSON Server
1. Tạo `db.json` với structure:
   ```json
   {
     "mobiles": [...],
     "accounts": [...]
   }
   ```
2. Chạy JSON Server: `json-server --watch db.json --port 3001`

### Bước 4: Tạo API Layer
1. Tạo `src/api/PhoneAPI.js` với Axios instance

### Bước 5: Tạo Context và Reducers
1. Tạo `AuthContext.jsx` và `AuthReducer.jsx`
2. Tạo `CartContext.jsx` và `CartReducer`
3. Tạo `FavouriteContext.jsx` và `favouriteReducer`

### Bước 6: Tạo Components
1. `NavBar.jsx` - Navigation bar
2. `PhoneList.jsx` - Danh sách sản phẩm
3. `ViewPhone.jsx` - Chi tiết sản phẩm
4. `LoginForm.jsx` - Form đăng nhập
5. `ConfirmModal.jsx` - Modal xác nhận

### Bước 7: Tạo Pages
1. `HomePage.jsx` - Trang chủ với carousel
2. `CartPage.jsx` - Trang giỏ hàng
3. `FavouritePage.jsx` - Trang yêu thích

### Bước 8: Setup Routing
1. Cập nhật `App.js` với `BrowserRouter` và `Routes`
2. Wrap app với các Context Providers

### Bước 9: Implement Features
1. Login flow với validation
2. Product listing với search và sort
3. Product detail page
4. Add to cart functionality
5. Favourite functionality
6. Cart management (update quantity, remove)

### Bước 10: Testing và Refinement
1. Test các luồng chính
2. Xóa code không cần thiết
3. Thêm PropTypes validation
4. Kiểm tra responsive design

---

## 🔍 Các Luồng Quan Trọng Khác

### Luồng Navigation:
```
NavBar → User click link → useNavigate() → React Router 
→ Route matching → Render component tương ứng
```

### Luồng State Management:
```
Component → useContext() → Context Provider → useReducer() 
→ Reducer function → Update state → Re-render components
```

### Luồng API Call:
```
Component → PhoneAPI.get() → Axios → JSON Server 
→ Response → Update state → Re-render UI
```

---

## 📝 Ghi Chú Quan Trọng

1. **JSON Server phải chạy trước khi chạy React app**
2. **Context Providers phải wrap toàn bộ app trong App.js**
3. **useParams() để lấy dynamic route parameters**
4. **useNavigate() để điều hướng giữa các trang**
5. **useContext() để truy cập global state**
6. **useReducer() để quản lý complex state**

---

## 🐛 Troubleshooting

### Lỗi thường gặp:
1. **404 khi fetch API**: Kiểm tra JSON Server có đang chạy không
2. **Cannot read property 'username'**: Kiểm tra user state có null không
3. **Routes không hoạt động**: Kiểm tra BrowserRouter đã wrap app chưa
4. **Context is undefined**: Kiểm tra component có nằm trong Provider không

---

## ✅ Checklist Hoàn Thành Dự Án

- [x] Setup project và dependencies
- [x] Tạo cấu trúc thư mục
- [x] Setup JSON Server với db.json
- [x] Tạo API layer (PhoneAPI.js)
- [x] Tạo AuthContext và AuthReducer
- [x] Tạo CartContext và CartReducer
- [x] Tạo FavouriteContext và FavouriteReducer
- [x] Tạo NavBar component
- [x] Tạo PhoneList component với search/sort
- [x] Tạo ViewPhone component
- [x] Tạo LoginForm với validation
- [x] Tạo HomePage với carousel
- [x] Tạo CartPage
- [x] Tạo FavouritePage
- [x] Setup routing trong App.js
- [x] Implement login flow
- [x] Implement cart functionality
- [x] Implement favourite functionality
- [x] Hiển thị username khi đăng nhập
- [x] Xóa code không cần thiết
- [x] Test tất cả các tính năng

---

**Tài liệu này giải thích chi tiết toàn bộ luồng và cách triển khai dự án Mobile Shop.**
