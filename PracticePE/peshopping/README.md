# 🛒 FreshFood Mart - E-Commerce Shopping App

Ứng dụng mua sắm trực tuyến đơn giản được xây dựng bằng React, cho phép người dùng xem sản phẩm và mua hàng.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Luồng dữ liệu](#luồng-dữ-liệu)
- [Mapping giữa các file](#mapping-giữa-các-file)
- [Giao diện](#giao-diện)
- [API Endpoints](#api-endpoints)

## 🎯 Tổng quan

**FreshFood Mart** là ứng dụng mua sắm trực tuyến được xây dựng với:
- **Frontend**: React 19.2.0 với React Router DOM
- **Backend**: JSON Server (giả lập REST API)
- **State Management**: Context API + useReducer
- **UI Framework**: React Bootstrap 5

## ✨ Tính năng

- ✅ **Trang chủ**: Hiển thị carousel tự động chuyển slide các sản phẩm
- ✅ **Trang cửa hàng**: Hiển thị danh sách sản phẩm dạng grid
- ✅ **Mua hàng**: Click "Mua ngay" để giảm số lượng sản phẩm
- ✅ **Quản lý state**: Global state management với Context API
- ✅ **Responsive**: Giao diện responsive với Bootstrap

## 🛠 Công nghệ sử dụng

### Core
- **React** ^19.2.0 - UI library
- **React Router DOM** ^7.9.5 - Client-side routing
- **React Bootstrap** ^2.10.10 - UI components

### State Management
- **Context API** - Global state management
- **useReducer** - State management với reducer pattern

### HTTP Client
- **Axios** ^1.13.1 - HTTP client để gọi API

### Backend
- **JSON Server** - REST API giả lập (cần cài đặt riêng)

### Build Tools
- **React Scripts** 5.0.1 - Build tool và dev server

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 14.0.0
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd peshopping
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cài đặt JSON Server (nếu chưa có)
```bash
npm install -g json-server
```

## 🚀 Chạy dự án

### Chạy JSON Server (Backend)
Mở terminal thứ nhất:
```bash
json-server --watch db.json --port 3001
```

### Chạy React App (Frontend)
Mở terminal thứ hai:
```bash
npm start
```

Ứng dụng sẽ mở tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
peshopping/
├── db.json                    # Database giả lập (JSON Server)
├── package.json               # Dependencies và scripts
├── README.md                  # File này
│
├── public/                    # Static files
│   ├── index.html            # HTML template
│   └── img/                  # Hình ảnh sản phẩm
│       ├── picture1.jpg
│       ├── picture2.jpg
│       └── picture3.jpg
│
└── src/                       # Source code
    ├── index.js              # Entry point - render App
    ├── index.css             # Global CSS
    ├── App.js                # Component chính - routing & layout
    ├── App.css               # CSS cho App component
    │
    ├── api/                  # API configuration
    │   └── StoreAPI.js       # Axios instance để gọi API
    │
    ├── context/              # Context API
    │   └── storeContext.jsx  # StoreProvider - quản lý global state
    │
    ├── reducers/             # Reducer functions
    │   └── storeReducer.jsx  # Reducer xử lý state changes
    │
    ├── components/           # Reusable components
    │   ├── HeaderComponent.jsx    # Header/Navbar
    │   ├── FooterComponent.jsx    # Footer
    │   ├── HomeCarosel.jsx         # Carousel component
    │   └── FoodDetail.jsx          # Product card component
    │
    └── pages/                # Page components
        ├── HomePage.jsx      # Trang chủ
        └── StorePage.jsx     # Trang cửa hàng
```

## 🔄 Luồng dữ liệu (Data Flow)

```
┌─────────────┐
│  db.json    │  ← Database (JSON Server)
└──────┬──────┘
       │
       │ GET /store
       ↓
┌─────────────┐
│ StoreAPI.js │  ← Axios instance (HTTP client)
└──────┬──────┘
       │
       │ storeAPI.get("/store")
       ↓
┌─────────────────────┐
│ storeContext.jsx    │  ← Context Provider (Global State)
│ - StoreProvider    │
│ - useStoreState()   │
│ - useStoreDispatch()│
└──────┬──────────────┘
       │
       │ useStoreState() / useStoreDispatch()
       ↓
┌─────────────────────┐
│  Components         │
│  - HomePage         │
│  - StorePage        │
│  - HomeCarosel      │
│  - FoodDetail       │
└──────┬──────────────┘
       │
       │ Render UI
       ↓
┌─────────────┐
│     UI      │  ← Giao diện người dùng
└─────────────┘
```

## 🔗 Mapping giữa các file

### 1. Entry Point
```
index.js
  ├── StoreProvider (context/storeContext.jsx)
  └── App (App.js)
```

### 2. Routing & Layout
```
App.js
  ├── HeaderComponent (components/HeaderComponent.jsx)
  ├── Routes
  │   ├── "/" → HomePage (pages/HomePage.jsx)
  │   └── "/store" → StorePage (pages/StorePage.jsx)
  └── FooterComponent (components/FooterComponent.jsx)
```

### 3. State Management
```
storeContext.jsx
  ├── useReducer (storeReducer.jsx)
  ├── fetchStore() → StoreAPI.js → db.json
  └── handleCreateOrUpdate() → StoreAPI.js → db.json
```

### 4. Pages
```
HomePage.jsx
  └── HomeCarosel.jsx
      └── useStoreState() → store.products → map() → Carousel

StorePage.jsx
  └── useStoreState() → store.products → map() → FoodDetail.jsx
```

### 5. Components
```
FoodDetail.jsx
  ├── Props: product (từ StorePage)
  └── useStoreDispatch() → handleCreateOrUpdate() → update stock
```

## 🎨 Giao diện

### Layout tổng thể
```
┌─────────────────────────────────────────────┐
│  HeaderComponent (Navbar)                   │
│  [Fresh Food Mart] [Home] [Store] [Login]   │
├─────────────────────────────────────────────┤
│                                             │
│  Routes (Nội dung thay đổi theo route)      │
│                                             │
│  - HomePage: Carousel các sản phẩm           │
│  - StorePage: Grid các product cards         │
│                                             │
├─────────────────────────────────────────────┤
│  FooterComponent                            │
│  © 2025 FreshFood Mart. All rights reserved.│
└─────────────────────────────────────────────┘
```

### Trang chủ (HomePage)
- **Carousel**: Tự động chuyển slide mỗi 3 giây
- Hiển thị hình ảnh các sản phẩm
- Nút điều hướng trái/phải

### Trang cửa hàng (StorePage)
- **Grid Layout**: Hiển thị các sản phẩm dạng grid
- **Product Card**: Mỗi sản phẩm là một card với:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Giá tiền
  - Số lượng còn lại
  - Nút "Mua ngay"

## 🔌 API Endpoints

Backend sử dụng JSON Server tại `http://localhost:3001`

### GET /store
Lấy thông tin cửa hàng và danh sách sản phẩm

**Response:**
```json
{
  "store": {
    "storeName": "FreshFood Mart",
    "location": "456 Hoàng Diệu, Hải Châu, Đà Nẵng",
    "products": [
      {
        "id": 1,
        "name": "Sườn Non - Heo Thảo Mộc",
        "img": "/img/picture1.jpg",
        "category": "Meat",
        "price": 71240,
        "stock": 18
      },
      ...
    ]
  }
}
```

### PUT /store
Cập nhật thông tin cửa hàng (bao gồm danh sách sản phẩm)

**Request Body:**
```json
{
  "store": {
    "storeName": "FreshFood Mart",
    "location": "...",
    "products": [...]
  }
}
```

## 📝 Cấu trúc dữ liệu

### Store Object
```javascript
{
  store: {
    storeName: string,      // Tên cửa hàng
    location: string,       // Địa chỉ
    products: [             // Mảng sản phẩm
      {
        id: number,         // ID duy nhất
        name: string,       // Tên sản phẩm
        img: string,        // Đường dẫn hình ảnh
        category: string,   // Danh mục
        price: number,      // Giá tiền
        stock: number       // Số lượng còn lại
      }
    ]
  },
  loading: boolean         // Trạng thái loading
}
```

## 🎯 Cách hoạt động

### 1. Khởi động ứng dụng
- `index.js` render `App` và bọc trong `StoreProvider`
- `StoreProvider` tự động gọi `fetchStore()` để tải dữ liệu từ API
- Dữ liệu được lưu vào global state

### 2. Hiển thị trang chủ
- User truy cập `/` → `HomePage` được render
- `HomeCarosel` lấy `store.products` từ Context
- Map qua `products` và hiển thị carousel

### 3. Xem cửa hàng
- User click "Store" trong navbar → `/store` → `StorePage` được render
- `StorePage` lấy `store.products` từ Context
- Map qua `products` và render các `FoodDetail` components

### 4. Mua hàng
- User click "Mua ngay" trên một sản phẩm
- `FoodDetail` gọi `handleCreateOrUpdate()` với stock giảm đi 1
- `StoreProvider` cập nhật state và gọi API PUT
- UI tự động cập nhật với số lượng mới

## 🐛 Troubleshooting

### Lỗi: Cannot connect to API
- Đảm bảo JSON Server đang chạy tại port 3001
- Kiểm tra `db.json` có tồn tại không

### Lỗi: Module not found
- Chạy `npm install` để cài đặt dependencies
- Kiểm tra tên file có đúng không (case-sensitive)

### Lỗi: Context is undefined
- Đảm bảo component được bọc trong `StoreProvider`
- Kiểm tra import `useStoreState`/`useStoreDispatch` có đúng không

## 📄 License

MIT License

## 👤 Author

FreshFood Mart Team

---

**Lưu ý**: Đây là dự án demo/learning. Để chạy production, cần:
- Thay thế JSON Server bằng backend thật
- Thêm authentication/authorization
- Thêm error handling tốt hơn
- Thêm validation
- Tối ưu performance
