# Motorbike Management Application - FER202

## 📋 Tổng quan dự án

Đây là ứng dụng quản lý xe máy được xây dựng bằng ReactJS, sử dụng JSON Server làm backend mock, React Router để điều hướng, và React Bootstrap để styling.

## 📁 Cấu trúc thư mục

```
motorbike/
├── public/                 # Thư mục chứa các file tĩnh (ảnh, favicon, etc.)
│   └── img/               # Chứa các ảnh xe máy (picture1.webp, picture2.jfif, ...)
│
├── src/                   # Thư mục chứa source code chính
│   ├── api/              # Chứa các file cấu hình và function gọi API
│   │   └── MotorbikeAPI.js    # Cấu hình axios để gọi API từ JSON Server
│   │
│   ├── components/       # Chứa các React components (UI components)
│   │   ├── LoginForm.jsx      # Component form đăng nhập
│   │   ├── MotobikesList.jsx  # Component hiển thị danh sách xe máy
│   │   ├── ViewMotorbike.jsx  # Component xem chi tiết một xe máy
│   │   ├── CartPage.jsx       # Component trang giỏ hàng
│   │   └── ConfirmModal.jsx   # Component modal xác nhận
│   │
│   ├── contexts/         # Chứa React Context để quản lý state global
│   │   ├── AuthContext.jsx    # Context quản lý authentication (login/logout)
│   │   └── CartContext.jsx    # Context quản lý giỏ hàng (add/remove/update)
│   │
│   ├── reducers/         # Chứa các reducer functions (useReducer)
│   │   ├── AuthReducer.js     # Reducer xử lý các action liên quan đến auth
│   │   └── LoginFormReducer.js # Reducer xử lý state của form login
│   │
│   ├── App.js            # Component chính, chứa routing và providers
│   ├── index.js          # Entry point của ứng dụng
│   └── App.css           # CSS styles cho App component
│
├── db.json               # File database mock cho JSON Server (chứa users và motobikes)
├── package.json          # File cấu hình dependencies và scripts
└── README.md            # File này - tài liệu hướng dẫn
```

## 🔄 Luồng hoạt động của ứng dụng

### 1. Khởi động ứng dụng

**File: `src/index.js`**

- Đây là entry point của ứng dụng
- Render component `<App />` vào DOM
- `App.js` được gọi và khởi tạo toàn bộ ứng dụng

### 2. Cấu hình Routing và Providers

**File: `src/App.js`**

- Cấu hình React Router với các routes:
  - `/` → LoginForm (trang đăng nhập)
  - `/motorbikes` → MotobikesList (danh sách xe máy)
  - `/view/:id` → ViewMotorbike (chi tiết xe máy)
  - `/cart` → CartPage (giỏ hàng)
- Wrap toàn bộ app với:
  - `AuthProvider` → Quản lý authentication state
  - `CartProvider` → Quản lý cart state

### 3. Luồng Đăng nhập (Login Flow)

#### Bước 1: Người dùng vào trang chủ

- Route `/` hiển thị component `LoginForm.jsx`

#### Bước 2: Người dùng nhập thông tin

**File: `src/components/LoginForm.jsx`**

- Component này sử dụng `LoginFormReducer` để quản lý state:
  - `username/email`: Tên đăng nhập hoặc email
  - `password`: Mật khẩu
  - `errors`: Lỗi validation
  - `showSuccessModal`: Hiển thị modal thành công

#### Bước 3: Submit form

**File: `src/components/LoginForm.jsx` → `handleSubmit()`**

1. Validate form (kiểm tra username và password có được nhập không)
2. Gọi `login()` từ `AuthContext`
3. `login()` được định nghĩa trong `src/contexts/AuthContext.jsx`

#### Bước 4: Xử lý đăng nhập

**File: `src/contexts/AuthContext.jsx` → `login()`**

1. Fetch danh sách users từ JSON Server: `GET /users`
2. Tìm user khớp với username/email và password
3. Kiểm tra status (không được locked)
4. Dispatch action `LOGIN_SUCCESS` hoặc `LOGIN_FAILURE`
5. `AuthReducer.js` xử lý action và cập nhật state

#### Bước 5: Chuyển hướng sau khi đăng nhập thành công

**File: `src/components/LoginForm.jsx`**

- Nếu login thành công → hiển thị modal "Welcome, [username]!"
- Sau 2 giây → navigate đến `/motorbikes`

### 4. Luồng Xem danh sách xe máy

**File: `src/components/MotobikesList.jsx`**

#### Bước 1: Component mount

- `useEffect` được gọi khi component render lần đầu
- Gọi API: `GET /motobikes` từ JSON Server
- Lưu dữ liệu vào state `motobikes`

#### Bước 2: Hiển thị danh sách

- Render danh sách xe máy dưới dạng cards
- Mỗi card hiển thị: tên, năm, giá, số lượng, ảnh
- Có 2 buttons: "View Details" và "Add to Cart"

#### Bước 3: Tìm kiếm và sắp xếp

- `useEffect` khác theo dõi `searchTerm` và `sortOrder`
- Filter danh sách theo model (search)
- Sắp xếp theo giá (ascending/descending)

#### Bước 4: Thêm vào giỏ hàng

- Khi click "Add to Cart":
  1. Gọi `handleAddToCart(motobike)`
  2. PATCH API để giảm `quantity` trong JSON Server
  3. Gọi `addToCart()` từ `CartContext` để thêm vào giỏ hàng
  4. Hiển thị thông báo thành công
  5. Cập nhật state local để giảm số lượng hiển thị

### 5. Luồng Xem chi tiết xe máy

**File: `src/components/ViewMotorbike.jsx`**

#### Bước 1: Nhận ID từ URL

- Sử dụng `useParams()` để lấy `id` từ route `/view/:id`
- Ví dụ: `/view/1` → `id = "1"`

#### Bước 2: Fetch dữ liệu

- `useEffect` gọi API: `GET /motobikes/:id`
- Lưu dữ liệu vào state `motorbike`

#### Bước 3: Hiển thị thông tin

- Layout 2 cột: ảnh bên trái, thông tin bên phải
- Hiển thị: Brand, Model, Year, Price, Quantity in Stock

#### Bước 4: Xử lý lỗi

- Nếu không tìm thấy (404) → hiển thị thông báo lỗi
- Nếu JSON Server không chạy → hiển thị hướng dẫn

### 6. Luồng Giỏ hàng (Cart)

**File: `src/components/CartPage.jsx`**

#### Bước 1: Lấy dữ liệu giỏ hàng

- Sử dụng `useCart()` hook từ `CartContext`
- Lấy danh sách items trong giỏ hàng

#### Bước 2: Hiển thị giỏ hàng

- Hiển thị trong bảng với các cột: Model, Price, Qty, Subtotal, Action
- Tính tổng tiền: `getTotalPrice()` từ CartContext

#### Bước 3: Cập nhật số lượng

- Khi thay đổi quantity:
  1. Tính sự khác biệt (diff) giữa số lượng mới và cũ
  2. PATCH API để cập nhật `quantity` trong JSON Server
  3. Gọi `updateQuantity()` từ CartContext

#### Bước 4: Xóa khỏi giỏ hàng

- Khi click "Remove":
  1. PATCH API để tăng lại `quantity` trong JSON Server (restore stock)
  2. Gọi `removeFromCart()` từ CartContext

## 🔑 Các Context và State Management

### AuthContext (`src/contexts/AuthContext.jsx`)

**Mục đích**: Quản lý authentication state toàn cục

**State**:

- `users`: Danh sách users từ server
- `currentUser`: User hiện tại đã đăng nhập
- `isAuthenticated`: Trạng thái đăng nhập
- `loading`: Trạng thái loading
- `error`: Lỗi nếu có

**Functions**:

- `login(identifier, password)`: Đăng nhập
- `logout()`: Đăng xuất
- `clearError()`: Xóa lỗi

**Được sử dụng ở**:

- `LoginForm.jsx` → Gọi `login()` và `error`
- Có thể được dùng ở bất kỳ component nào để check authentication

### CartContext (`src/contexts/CartContext.jsx`)

**Mục đích**: Quản lý giỏ hàng toàn cục

**State**:

- `items`: Danh sách items trong giỏ hàng (mỗi item có quantity)

**Functions**:

- `addToCart(motorbike)`: Thêm xe máy vào giỏ hàng
- `updateQuantity(id, quantity)`: Cập nhật số lượng
- `removeFromCart(id)`: Xóa khỏi giỏ hàng
- `clearCart()`: Xóa toàn bộ giỏ hàng
- `getTotalPrice()`: Tính tổng tiền

**Được sử dụng ở**:

- `MotobikesList.jsx` → Gọi `addToCart()`
- `CartPage.jsx` → Sử dụng tất cả functions

## 📡 API Integration

### MotorbikeAPI (`src/api/MotorbikeAPI.js`)

**Mục đích**: Cấu hình axios để gọi API từ JSON Server

**Cấu hình**:

- Base URL: `http://localhost:3001`
- Timeout: 5000ms
- Headers: `Content-Type: application/json`

**Được sử dụng ở**:

- `MotobikesList.jsx` → `GET /motobikes`, `PATCH /motobikes/:id`
- `ViewMotorbike.jsx` → `GET /motobikes/:id`
- `CartPage.jsx` → `GET /motobikes/:id`, `PATCH /motobikes/:id`
- `AuthContext.jsx` → `GET /users`

## 🗄️ Database (JSON Server)

**File: `db.json`**

**Cấu trúc**:

```json
{
  "users": [
    {
      "id": 1,
      "username": "tai",
      "password": "123456",
      "email": "ptttai123@gmail.com",
      "role": "user",
      "status": "active"
    }
  ],
  "motobikes": [
    {
      "id": 1,
      "name": "Yamaha MT-15",
      "brand": "Yamaha",
      "model": "MT-15 2024",
      "year": 2024,
      "image": "img/picture1.webp",
      "price": "72,000,000 VND",
      "quantity": 8
    }
  ]
}
```

**Khởi động JSON Server**:

```bash
json-server --watch db.json --port 3001
```

## 🔄 Data Flow (Luồng dữ liệu)

### Login Flow:

```
User Input → LoginForm.jsx
  → validate()
  → AuthContext.login()
  → API GET /users
  → AuthReducer (update state)
  → Navigate to /motorbikes
```

### Add to Cart Flow:

```
User clicks "Add to Cart"
  → MotobikesList.handleAddToCart()
  → API PATCH /motobikes/:id (decrease quantity)
  → CartContext.addToCart()
  → Update local state
  → Show success message
```

### View Details Flow:

```
User clicks "View Details"
  → Navigate to /view/:id
  → ViewMotorbike component mounts
  → API GET /motobikes/:id
  → Display motorbike details
```

### Cart Update Flow:

```
User changes quantity in cart
  → CartPage.handleUpdateQuantity()
  → API GET /motobikes/:id (get current stock)
  → Calculate new stock
  → API PATCH /motobikes/:id (update stock)
  → CartContext.updateQuantity()
  → Re-render cart
```

## 🚀 Cách chạy ứng dụng

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động JSON Server (Terminal 1)

```bash
json-server --watch db.json --port 3001
```

### 3. Khởi động React App (Terminal 2)

```bash
npm start
```

### 4. Truy cập ứng dụng

- Mở browser: `http://localhost:3000`
- Login với: username: `tai`, password: `123456`

## 📝 Các tính năng chính

1. ✅ Đăng nhập với validation
2. ✅ Xem danh sách xe máy
3. ✅ Tìm kiếm theo model
4. ✅ Sắp xếp theo giá
5. ✅ Xem chi tiết xe máy
6. ✅ Thêm vào giỏ hàng
7. ✅ Quản lý giỏ hàng (update quantity, remove)
8. ✅ Quản lý stock (tự động giảm/tăng khi thêm/xóa khỏi cart)

## 🔍 Các file quan trọng và mục đích

| File                | Mục đích                      | Được gọi từ                                   |
| ------------------- | ----------------------------- | --------------------------------------------- |
| `App.js`            | Cấu hình routing và providers | `index.js`                                    |
| `LoginForm.jsx`     | Form đăng nhập                | `App.js` (route `/`)                          |
| `MotobikesList.jsx` | Danh sách xe máy              | `App.js` (route `/motorbikes`)                |
| `ViewMotorbike.jsx` | Chi tiết xe máy               | `App.js` (route `/view/:id`)                  |
| `CartPage.jsx`      | Trang giỏ hàng                | `App.js` (route `/cart`)                      |
| `AuthContext.jsx`   | Quản lý auth state            | `App.js`, `LoginForm.jsx`                     |
| `CartContext.jsx`   | Quản lý cart state            | `App.js`, `MotobikesList.jsx`, `CartPage.jsx` |
| `MotorbikeAPI.js`   | Cấu hình API calls            | Tất cả components cần gọi API                 |
