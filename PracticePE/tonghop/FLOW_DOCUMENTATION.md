# Tài liệu giải thích các luồng hoạt động trong ứng dụng

## 📋 Mục lục
1. [Luồng Login](#luồng-login)
2. [Luồng Add to Cart](#luồng-add-to-cart)
3. [Luồng Add to Favorite](#luồng-add-to-favorite)
4. [Luồng hiển thị sản phẩm](#luồng-hiển-thị-sản-phẩm)

---

## 🔐 Luồng Login

### Các file liên quan:
1. **src/context/AuthContext.js** - Xử lý logic đăng nhập
2. **src/components/auth/LoginForm.jsx** - Form nhận input
3. **src/pages/LoginPage.jsx** - Trang đăng nhập
4. **src/layouts/AuthLayout.jsx** - Layout cho trang login
5. **src/routes/AppRoutes.js** - Định nghĩa route `/login`
6. **src/context/ToastContext.js** - Hiển thị thông báo
7. **src/config.js** - Cấu hình API URL
8. **db.json** - Database chứa accounts

### Các bước chi tiết:

```
1. User mở trang /login
   → AppRoutes.js route "/login" → LoginPage.jsx
   → LoginPage render LoginForm với AuthLayout

2. User nhập email/username và password
   → LoginForm.jsx: State lưu input

3. User click nút "Login"
   → LoginForm gọi: const result = await login(email, password)
   → login() được lấy từ: const { login } = useContext(AuthContext)

4. AuthContext.login() thực hiện:
   a. Fetch GET http://localhost:3001/accounts
   b. Tìm user trong accounts khớp email/username và password
   c. Kiểm tra:
      - Không tìm thấy → return { success: false, message: "Invalid..." }
      - Tài khoản deactivate → return { success: false, message: "Account deactivated" }
      - Hợp lệ → tiếp tục
   d. Tạo userData = { id, name, email, avatar }
   e. setUser(userData) → Cập nhật state
   f. sessionStorage.setItem("user", JSON.stringify(userData)) → Lưu để giữ đăng nhập
   g. navigate(redirectPath) → Chuyển về trang trước đó
   h. showToast("Login successful!", "success") → Hiển thị thông báo
   i. return { success: true }

5. LoginForm nhận kết quả:
   - success: true → Form tự động redirect (do navigate trong AuthContext)
   - success: false → Hiển thị error message

6. Header.jsx tự động cập nhật:
   - isAuthenticated = true
   - Hiển thị thông tin user và nút logout
```

---

## 🛒 Luồng Add to Cart

### Các file liên quan:
1. **src/context/CartContext.js** - Quản lý state giỏ hàng
2. **src/components/products/ProductCard.jsx** - Nút "Add to Cart" trong danh sách
3. **src/pages/ProductDetailPage.jsx** - Nút "Add to Cart" ở trang chi tiết
4. **src/pages/CartPage.jsx** - Trang hiển thị giỏ hàng
5. **src/layouts/Header.jsx** - Badge số lượng items
6. **src/context/ToastContext.js** - Thông báo khi thêm vào cart

### Các bước chi tiết:

```
1. User click nút "Add to Cart" (ở ProductCard hoặc ProductDetailPage)
   → handleAddToCart() được gọi
   → e.preventDefault() và e.stopPropagation() để tránh navigate

2. Tạo productToAdd object:
   {
     id: productId,
     name: productTitle,
     price: productPrice,
     image: productImage,
     description: productDescription
   }

3. Gọi addToCart(productToAdd)
   → addToCart được lấy từ: const { addToCart } = useCart()
   → useCart() là hook từ CartContext.js

4. CartContext.addToCart() thực hiện:
   → dispatch({ type: "ADD_TO_CART", payload: product })
   → cartReducer xử lý action ADD_TO_CART

5. cartReducer kiểm tra:
   - Tìm existingItem = state.items.find(item => item.id === product.id)
   - Nếu đã có:
     → Tăng quantity: item.quantity + 1
   - Nếu chưa có:
     → Thêm mới: [...state.items, { ...product, quantity: 1 }]

6. State được cập nhật:
   → items: [...] (state mới)
   → Tất cả components sử dụng useCart() tự động re-render

7. Hiển thị thông báo:
   → showToast("${productTitle} đã được thêm vào giỏ hàng!", "success")
   → ToastContext hiển thị toast notification

8. Header.jsx tự động cập nhật:
   → Badge số lượng items hiển thị: cartItems.length

9. User vào /cart:
   → CartPage.jsx hiển thị danh sách items
   → Có thể update quantity, remove items
```

---

## ❤️ Luồng Add to Favorite

### Các file liên quan:
1. **src/context/FavoriteContext.js** - Quản lý state yêu thích
2. **src/components/products/ProductCard.jsx** - Nút "Favorite"
3. **src/pages/ProductDetailPage.jsx** - Nút "Favorite"
4. **src/pages/FavoritePage.jsx** - Trang danh sách yêu thích
5. **src/layouts/Header.jsx** - Badge số lượng items

### Các bước chi tiết:

```
1. User click nút "Favorite" (ở ProductCard hoặc ProductDetailPage)
   → handleFavorite() được gọi

2. Kiểm tra trạng thái hiện tại:
   → const isFavorited = isFavorite(productId)
   → isFavorite() từ FavoriteContext kiểm tra: state.items.some(item => item.id === id)

3. Nếu đã yêu thích (isFavorited = true):
   → removeFromFavorite(productId)
   → dispatch({ type: "REMOVE_FROM_FAVORITE", payload: { id } })
   → favoriteReducer lọc bỏ: items.filter(item => item.id !== id)
   → showToast("Đã xóa khỏi danh sách yêu thích!")

4. Nếu chưa yêu thích (isFavorited = false):
   → Tạo productToFavorite object
   → addToFavorite(productToFavorite)
   → dispatch({ type: "ADD_TO_FAVORITE", payload: product })
   → favoriteReducer kiểm tra:
     - Nếu đã có → return state (không thêm)
     - Nếu chưa có → [...state.items, product]
   → showToast("Đã thêm vào danh sách yêu thích!")

5. UI tự động cập nhật:
   → Nút Favorite đổi màu: variant="danger" (đỏ) nếu đã yêu thích
   → Text đổi: "Favorited" nếu đã yêu thích, "Favorite" nếu chưa
   → Header badge cập nhật: favoriteItems.length

6. User vào /favourites:
   → FavoritePage.jsx hiển thị danh sách items dạng card
   → Có thể xem chi tiết hoặc xóa khỏi yêu thích
```

---

## 📦 Luồng hiển thị sản phẩm

### Các file liên quan:
1. **src/context/ProductContext.js** - Fetch và quản lý danh sách sản phẩm
2. **src/pages/HomePage.jsx** - Trang chủ (hiển thị Hero)
3. **src/pages/ProductsPage.jsx** - Trang danh sách sản phẩm
4. **src/components/products/ProductList.jsx** - Component danh sách với filter
5. **src/components/products/ProductCard.jsx** - Card hiển thị từng sản phẩm
6. **src/components/products/Filter.jsx** - Component filter/search
7. **src/pages/ProductDetailPage.jsx** - Trang chi tiết sản phẩm
8. **src/config.js** - Cấu hình API URL và field mapping

### Các bước chi tiết:

```
1. App khởi động:
   → index.js render App với ProductProvider
   → ProductProvider mount → useEffect chạy

2. ProductContext.fetchProducts():
   → Fetch GET http://localhost:3001/products
   → setProducts(rawData)
   → setLoading(false)

3. HomePage.jsx:
   → const { products, loading } = useProducts()
   → Hiển thị Hero component (carousel 3 sản phẩm đầu tiên)
   → products.slice(0, 3)

4. ProductsPage.jsx:
   → const { products, loading, error } = useProducts()
   → Render ProductList component với products prop

5. ProductList.jsx:
   → Nhận products prop
   → State quản lý: searchTerm, sortOption, brandFilter, tagFilter
   → useMemo tính toán visibleProducts:
     - Lọc theo searchTerm (tìm trong productTitle)
     - Lọc theo brandFilter
     - Lọc theo tagFilter (sale, hot, etc.)
     - Sắp xếp theo sortOption (name, price, date)
     - Phân trang: slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

6. ProductCard.jsx:
   → Nhận product prop
   → Hiển thị: image, title, description, price
   → Nút "View Details" → Link to={`/product/${productId}`}
   → Nút "Add to Cart" → handleAddToCart()
   → Nút "Favorite" → handleFavorite()

7. User click "View Details":
   → Navigate to /product/:id
   → ProductDetailPage.jsx mount

8. ProductDetailPage.jsx:
   → const { id } = useParams() → Lấy id từ URL
   → const { products } = useProducts()
   → const product = products.find(p => p.id === id)
   → Hiển thị chi tiết: image, title, price, description
   → Nút "Add to Cart" và "Favorite"
```

---

## 🔄 Cấu trúc Context Providers

```
index.js
└── BrowserRouter
    └── ToastProvider
        └── AuthProvider
            └── ProductProvider
                └── CartProvider
                    └── FavoriteProvider
                        └── App
                            └── AppRoutes
```

### Thứ tự quan trọng:
- **ToastProvider** ngoài cùng: Cần cho AuthProvider (hiển thị toast login)
- **AuthProvider**: Cần cho các component khác kiểm tra authentication
- **ProductProvider**: Cung cấp danh sách sản phẩm
- **CartProvider**: Quản lý giỏ hàng
- **FavoriteProvider**: Quản lý yêu thích

---

## 📝 Ghi chú

- Tất cả state được quản lý qua Context API
- sessionStorage chỉ lưu user (để giữ đăng nhập)
- Cart và Favorite state không lưu vào localStorage (mất khi refresh)
- Toast notifications tự động disappear sau vài giây
- Routes được định nghĩa trong AppRoutes.js với nested routes

