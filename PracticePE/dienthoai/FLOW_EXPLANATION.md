# Mobile Shop - Giải Thích Chi Tiết Các Luồng Hoạt Động

## 📚 Mục Lục

1. [Luồng Đăng Nhập Chi Tiết](#1-luồng-đăng-nhập-chi-tiết)
2. [Luồng Hiển Thị Sản Phẩm](#2-luồng-hiển-thị-sản-phẩm)
3. [Luồng Giỏ Hàng](#3-luồng-giỏ-hàng)
4. [Luồng Favourite](#4-luồng-favourite)
5. [Các File Quan Trọng](#5-các-file-quan-trọng)

---

## 1. Luồng Đăng Nhập Chi Tiết

### 1.1. Khởi Tạo AuthContext

**File: `src/context/AuthContext.jsx`**

```javascript
// Bước 1: Tạo Context
export const AuthContext = createContext();

// Bước 2: Tạo AuthProvider Component
export function AuthProvider({ children }) {
  // Sử dụng useReducer để quản lý state phức tạp
  const [state, dispatch] = useReducer(authReducer, initialState);

  // State ban đầu:
  // {
  //   user: null,              // User hiện tại (null = chưa đăng nhập)
  //   users: [],               // Danh sách users từ server
  //   loading: false,          // Trạng thái loading
  //   error: null,             // Lỗi nếu có
  //   isAuthenticated: false   // Đã đăng nhập chưa
  // }
}
```

### 1.2. Fetch Users từ JSON Server

**File: `src/context/AuthContext.jsx`**

```javascript
// Khi AuthProvider mount → useEffect chạy
useEffect(() => {
  fetchUser(); // Gọi hàm fetch users
}, [fetchUser]);

const fetchUser = useCallback(async () => {
  dispatch({ type: "START_LOADING" }); // Bắt đầu loading

  try {
    // Gọi API GET /accounts từ JSON Server
    // URL: http://localhost:3001/accounts
    const response = await PhoneAPI.get("/accounts");

    // Response data có dạng:
    // [
    //   { id: 1, username: "admin", email: "admin@example.com", password: "admin123" },
    //   { id: 2, username: "user1", email: "user1@example.com", password: "password123" },
    //   ...
    // ]

    // Dispatch SET_USERS → lưu vào state.users
    dispatch({ type: "SET_USERS", payload: response.data });
  } catch (error) {
    // Nếu lỗi → set users = []
    dispatch({ type: "SET_USERS", payload: [] });
  }
}, [dispatch]);
```

### 1.3. User Nhập Thông Tin

**File: `src/components/LoginForm.jsx`**

```javascript
function LoginForm() {
  // Lấy các functions và state từ AuthContext
  const { login, loading, error, clearError, user } = useAuth();

  // Quản lý state của form (identifier, password, errors)
  const [formState, dispatch] = useReducer(loginFormReducer, initialFormState);

  // Khi user nhập vào input
  const handleChange = (e) => {
    const { name, value } = e.target; // name = "identifier" hoặc "password", value = giá trị nhập vào

    // Cập nhật giá trị vào state
    dispatch({ type: "SET_FIELD", field: name, value });

    // Clear error từ AuthContext để không hiển thị lỗi cũ
    clearError();

    // Validation real-time
    if (name === "identifier") {
      if (!value.trim()) {
        // Rỗng → hiển thị lỗi
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Username or Email is required.",
        });
      } else {
        // Có giá trị → clear error
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }

    // Tương tự cho password
    if (name === "password") {
      if (!value.trim()) {
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Password is required.",
        });
      } else {
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }
  };
}
```

### 1.4. User Submit Form

**File: `src/components/LoginForm.jsx`**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault(); // Ngăn form submit mặc định (reload page)

  // Validate form trước khi submit
  let isValid = true;

  if (!formState.identifier.trim()) {
    dispatch({
      type: "SET_ERROR",
      field: "identifier",
      message: "Username or Email is required.",
    });
    isValid = false;
  }

  if (!formState.password.trim()) {
    dispatch({
      type: "SET_ERROR",
      field: "password",
      message: "Password is required.",
    });
    isValid = false;
  }

  // Nếu có lỗi → dừng lại
  if (!isValid) return;

  // Gọi login() từ AuthContext
  // login() trả về Promise với { ok: boolean, account?: Object }
  const result = await login(formState.identifier, formState.password);

  if (result.ok) {
    // Login thành công
    // 1. Hiển thị modal thành công
    dispatch({ type: "SHOW_SUCCESS_MODAL" });

    // 2. Sau 2 giây → redirect đến /mobiles
    setTimeout(() => {
      dispatch({ type: "HIDE_SUCCESS_MODAL" });
      navigate("/mobiles"); // Chuyển đến trang danh sách sản phẩm
    }, 2000);
  }
  // Nếu thất bại → error từ AuthContext sẽ được hiển thị tự động
};
```

### 1.5. AuthContext Xử Lý Login

**File: `src/context/AuthContext.jsx`**

```javascript
function login(identifier, password) {
  // Bước 1: Dispatch LOGIN_START → set loading = true, error = null
  dispatch({ type: "LOGIN_START" });

  // Bước 2: Return Promise để có thể dùng async/await
  return new Promise((resolve) => {
    setTimeout(() => {
      // Bước 3: Kiểm tra identifier là email hay username
      const isEmail = identifier.includes("@");

      // Bước 4: Tìm user trong danh sách users
      const account = state.users.find(
        (acc) =>
          isEmail
            ? acc.email === identifier && acc.password === password // Nếu là email
            : acc.username === identifier && acc.password === password // Nếu là username
      );

      // Bước 5: Kiểm tra kết quả
      if (!account) {
        // Không tìm thấy → dispatch LOGIN_FAILURE
        dispatch({
          type: "LOGIN_FAILURE",
          payload: "Invalid username or password!",
        });
        resolve({ ok: false });
        return;
      }

      // Kiểm tra account có bị khóa không
      if (account.status === "locked") {
        dispatch({ type: "LOGIN_FAILURE", payload: "Account locked." });
        resolve({ ok: false });
        return;
      }

      // Bước 6: Hợp lệ → dispatch LOGIN_SUCCESS
      dispatch({ type: "LOGIN_SUCCESS", payload: account });
      resolve({ ok: true, account });
    }, 1000); // Delay 1 giây để mô phỏng API call
  });
}
```

### 1.6. AuthReducer Xử Lý Actions

**File: `src/reducers/AuthReducer.jsx`**

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
        user: action.payload, // Lưu thông tin user đã đăng nhập
        loading: false,
        isAuthenticated: true, // Đánh dấu đã đăng nhập
      };

    case "LOGIN_FAILURE":
      // Login thất bại → lưu error message
      return {
        ...state,
        loading: false,
        error: action.payload, // Lưu thông báo lỗi
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

### 1.7. Hiển Thị Kết Quả

**File: `src/components/LoginForm.jsx`**

```javascript
return (
  <Container>
    {/* Hiển thị error từ AuthContext nếu có */}
    {error && (
      <Alert variant="danger" onClose={clearError} dismissible>
        {error}
      </Alert>
    )}

    {/* Form đăng nhập */}
    <Form onSubmit={handleSubmit}>{/* Input fields */}</Form>

    {/* Modal thành công */}
    <ConfirmModal
      show={formState.showSuccessModal}
      title="Login Successful"
      message={`Welcome, ${user?.username}! Login successful.`}
    />
  </Container>
);
```

### 1.8. NavBar Hiển Thị Username

**File: `src/components/NavBar.jsx`**

```javascript
function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Navbar>
      {/* Kiểm tra đã đăng nhập chưa */}
      {isAuthenticated && user ? (
        // Đã đăng nhập → hiển thị dropdown với username
        <NavDropdown title={`👤 ${user.username}`}>
          <NavDropdown.Item disabled>
            <small>{user.email}</small>
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            🚪 Logout
          </NavDropdown.Item>
        </NavDropdown>
      ) : (
        // Chưa đăng nhập → hiển thị Login và Register
        <>
          <Nav.Link onClick={() => navigate("/login")}>🔐 Login</Nav.Link>
          <Nav.Link onClick={() => navigate("/register")}>📝 Register</Nav.Link>
        </>
      )}
    </Navbar>
  );
}
```

---

## 2. Luồng Hiển Thị Sản Phẩm

### 2.1. Route Định Nghĩa

**File: `src/App.js`**

```javascript
<Routes>
  {/* Route cho danh sách sản phẩm */}
  <Route path="/mobiles" element={<PhoneList />} />

  {/* Route cho chi tiết sản phẩm (dynamic route với :id) */}
  <Route path="/mobiles/:id" element={<ViewPhone />} />
</Routes>
```

### 2.2. PhoneList Fetch Danh Sách

**File: `src/components/PhoneList.jsx`**

```javascript
function PhoneList() {
  const [mobiles, setMobiles] = useState([]); // Danh sách sản phẩm từ API
  const [filteredMobiles, setFilteredMobiles] = useState([]); // Danh sách sau khi filter/sort
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có

  // Fetch danh sách khi component mount
  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true);

        // Gọi API GET /mobiles từ JSON Server
        // URL: http://localhost:3001/mobiles
        const response = await PhoneAPI.get("/mobiles");

        // Response.data có dạng:
        // [
        //   { id: 1, name: "iPhone 15 Pro Max", price: 29990000, ... },
        //   { id: 2, name: "Samsung Galaxy S24 Ultra", price: 28990000, ... },
        //   ...
        // ]

        setMobiles(response.data); // Lưu danh sách gốc
        setFilteredMobiles(response.data); // Lưu danh sách để hiển thị
        setError(null);
      } catch (err) {
        setError(`Không thể tải danh sách mobiles...`);
      } finally {
        setLoading(false);
      }
    };

    fetchMobiles(); // Chạy khi component mount
  }, []); // [] = chỉ chạy 1 lần khi mount
}
```

### 2.3. Filter và Sort

**File: `src/components/PhoneList.jsx`**

```javascript
const [searchTerm, setSearchTerm] = useState("");     // Từ khóa tìm kiếm
const [sortOrder, setSortOrder] = useState("none");   // Thứ tự sắp xếp

// useEffect chạy lại khi searchTerm, sortOrder, hoặc mobiles thay đổi
useEffect(() => {
  let filtered = [...mobiles]; // Copy danh sách gốc

  // Bước 1: Tìm kiếm theo tên
  if (searchTerm) {
    filtered = filtered.filter((mobile) =>
      mobile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Bước 2: Sắp xếp
  if (sortOrder === "name-asc") {
    // Sắp xếp A-Z
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "price-asc") {
    // Sắp xếp giá tăng dần
    filtered.sort((a, b) => {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(...);
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(...);
      return priceA - priceB;
    });
  }

  // Bước 3: Cập nhật danh sách đã filter/sort
  setFilteredMobiles(filtered);
}, [searchTerm, sortOrder, mobiles]);
```

### 2.4. ViewPhone Fetch Chi Tiết

**File: `src/components/ViewPhone.jsx`**

```javascript
function ViewPhone() {
  const { id } = useParams(); // Lấy ID từ URL (ví dụ: /mobiles/1 → id = "1")
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    const fetchMobile = async () => {
      if (!id) {
        setError("No mobile ID provided.");
        return;
      }

      try {
        setLoading(true);

        // Gọi API GET /mobiles/:id
        // URL: http://localhost:3001/mobiles/1
        const response = await PhoneAPI.get(`/mobiles/${id}`);

        // Response.data có dạng:
        // {
        //   id: 1,
        //   name: "iPhone 15 Pro Max",
        //   description: "...",
        //   price: 29990000,
        //   image: "..."
        // }

        if (response.data) {
          setMobile(response.data); // Lưu thông tin mobile vào state
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(`Mobile with ID ${id} not found.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMobile(); // Chạy khi component mount hoặc id thay đổi
  }, [id]); // Chạy lại khi id thay đổi
}
```

---

## 3. Luồng Giỏ Hàng

### 3.1. Thêm Vào Giỏ Hàng

**File: `src/components/PhoneList.jsx`**

```javascript
const { addToCart } = useCart(); // Lấy function từ CartContext

const handleAddToCart = (mobile) => {
  // Gọi addToCart() từ CartContext
  addToCart(mobile);

  // Hiển thị thông báo thành công
  setSuccessMessage(`${mobile.name} has been added to your cart.`);
  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
};
```

### 3.2. CartContext Xử Lý

**File: `src/context/CartContext.jsx`**

```javascript
const addToCart = (mobile) => {
  // Dispatch action ADD_TO_CART với payload là mobile object
  dispatch({ type: "ADD_TO_CART", payload: mobile });
};

// CartReducer xử lý:
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
  }
};
```

### 3.3. CartPage Hiển Thị

**File: `src/pages/CartPage.jsx`**

```javascript
function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  return (
    <Container>
      <Table>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{formatPrice(item.price)}</td>
              <td>
                {/* Button giảm quantity */}
                <Button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>

                {/* Input quantity */}
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                />

                {/* Button tăng quantity */}
                <Button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </td>
              <td>{formatPrice(item.price * item.quantity)}</td>
              <td>
                <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total:</td>
            <td>{formatPrice(getTotalPrice())}</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
}
```

---

## 4. Luồng Favourite

### 4.1. Thêm Vào Favourite

**File: `src/components/PhoneList.jsx`**

```javascript
const { addToFavourite, isFavourite } = useFavourite();

const handleFavourite = (mobile) => {
  if (isFavourite(mobile.id)) {
    // Đã có trong favourites → hiển thị thông báo
    setSuccessMessage(`${mobile.name} is already in your favourites.`);
  } else {
    // Chưa có → thêm vào favourites
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
</Button>;
```

### 4.2. FavouriteContext Xử Lý

**File: `src/context/FavouriteContext.jsx`**

```javascript
const addToFavourite = (mobile) => {
  dispatch({ type: "ADD_TO_FAVOURITE", payload: mobile });
};

const favouriteReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVOURITE":
      // Kiểm tra đã có chưa
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
  }
};
```

---

## 5. Các File Quan Trọng

### 5.1. App.js - Entry Point

```javascript
function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Enable routing */}
      <AuthProvider>
        {" "}
        {/* Wrap app với AuthProvider để quản lý authentication */}
        <CartProvider>
          {" "}
          {/* Wrap app với CartProvider để quản lý giỏ hàng */}
          <FavouriteProvider>
            {" "}
            {/* Wrap app với FavouriteProvider */}
            <NavBar /> {/* Hiển thị trên mọi trang */}
            <Routes>
              {" "}
              {/* Định nghĩa các routes */}
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

### 5.2. PhoneAPI.js - API Configuration

```javascript
import axios from "axios";

// Tạo Axios instance với cấu hình mặc định
const PhoneApi = axios.create({
  baseURL: "http://localhost:3001", // Base URL của JSON Server
  timeout: 5000, // Timeout 5 giây
  headers: {
    "Content-Type": "application/json", // Header mặc định
  },
});

export default PhoneApi;

// Sử dụng:
// PhoneAPI.get("/mobiles") → GET http://localhost:3001/mobiles
// PhoneAPI.get("/mobiles/1") → GET http://localhost:3001/mobiles/1
```

---

## 📝 Tóm Tắt Luồng Tổng Quan

1. **User truy cập app** → App.js render → NavBar + Routes
2. **User click Login** → Navigate to /login → LoginForm render
3. **User nhập thông tin** → handleChange → Validate → Update state
4. **User submit** → handleSubmit → login() → AuthContext → AuthReducer → Update state
5. **Login thành công** → Set user state → Show modal → Navigate to /mobiles
6. **NavBar detect isAuthenticated** → Show username dropdown → Hide Login/Register
7. **User browse products** → PhoneList fetch → Display → User click View Details
8. **ViewPhone fetch detail** → Display → User click Add to Cart/Favourite
9. **Add to Cart** → CartContext → CartReducer → Update cart state
10. **User click Cart** → Navigate to /cart → CartPage display items

---

**Tài liệu này giải thích chi tiết từng bước trong các luồng hoạt động của ứng dụng Mobile Shop.**
