# Khắc phục lỗi đăng nhập: "Không thể tải danh sách người dùng"

## Vấn đề
Khi đăng nhập, bạn gặp lỗi: "Không thể tải danh sách người dùng. Vui lòng thử lại."

## Nguyên nhân có thể
1. **JSON Server chưa chạy hoặc chạy không đúng cách**
2. **Lỗi CORS** - Server không cho phép requests từ React app
3. **Proxy không hoạt động** - React dev server không proxy requests đến JSON server
4. **Port 3001 bị chiếm dụng** - Port đã được sử dụng bởi ứng dụng khác

## Giải pháp

### Bước 1: Kiểm tra JSON Server đang chạy

Mở trình duyệt và truy cập: **http://localhost:3001/users**

Nếu thấy dữ liệu JSON (danh sách users), server đang chạy đúng.

Nếu không thấy dữ liệu hoặc lỗi "Cannot GET /users":
- JSON Server chưa chạy
- File `db.json` không đúng định dạng
- Port 3001 bị chiếm dụng

### Bước 2: Khởi động JSON Server với CORS enabled

**QUAN TRỌNG:** Phải khởi động server với CORS enabled để React app có thể gọi API.

#### Cách 1: Sử dụng script có sẵn (Khuyến nghị)

```bash
cd reactferestaurant
npm run server
```

Script này sẽ:
- Khởi động JSON Server với CORS enabled
- Sử dụng file `start-server.js` có cấu hình CORS
- Chạy trên port 3001

#### Cách 2: Sử dụng json-server trực tiếp

```bash
cd reactferestaurant
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

**Lưu ý:** Cách này có thể gặp lỗi CORS nếu server không hỗ trợ CORS.

### Bước 3: Kiểm tra React App

1. **Đảm bảo React app đang chạy:**
   ```bash
   npm start
   ```

2. **Kiểm tra console trong trình duyệt:**
   - Mở Developer Tools (F12)
   - Xem tab Console
   - Tìm các log bắt đầu bằng `[API]` hoặc `[AuthContext]`
   - Xem có lỗi CORS không

3. **Kiểm tra Network tab:**
   - Xem request đến `/users` có thành công không (status 200)
   - Xem response có trả về dữ liệu không

### Bước 4: Xử lý lỗi CORS

Nếu gặp lỗi CORS trong console:

#### Giải pháp A: Sử dụng Proxy (Mặc định)

React app đã được cấu hình proxy trong `package.json`:
```json
"proxy": "http://localhost:3001"
```

Proxy sẽ tự động chuyển tiếp requests từ React app đến JSON server.

**Lưu ý:** 
- Proxy chỉ hoạt động trong development mode
- Có thể cần restart React app sau khi thay đổi cấu hình proxy

#### Giải pháp B: Sử dụng Direct URL với CORS

Nếu proxy không hoạt động, bạn có thể sử dụng direct URL:

1. Tạo file `.env` trong thư mục `reactferestaurant`:
   ```
   REACT_APP_USE_PROXY=false
   ```

2. Khởi động JSON Server với CORS enabled:
   ```bash
   npm run server
   ```

3. Restart React app:
   ```bash
   npm start
   ```

### Bước 5: Kiểm tra cấu hình API

File `src/services/api.js` đã được cấu hình để:
- Sử dụng proxy trong development (mặc định)
- Hoặc sử dụng direct URL nếu `REACT_APP_USE_PROXY=false`
- Log chi tiết các requests và responses

Kiểm tra console để xem:
- URL nào đang được sử dụng
- Request có được gửi đi không
- Response có về không

## Kiểm tra nhanh

1. **JSON Server có chạy không?**
   ```bash
   # PowerShell
   Invoke-WebRequest -Uri http://localhost:3001/users -Method GET
   
   # hoặc mở trình duyệt
   http://localhost:3001/users
   ```

2. **React app có chạy không?**
   - Truy cập http://localhost:3000
   - Xem có hiển thị trang login không

3. **Console có lỗi gì không?**
   - Mở Developer Tools (F12)
   - Xem tab Console và Network

## Log để kiểm tra

Khi đăng nhập, bạn sẽ thấy các log sau trong console:

```
[API] Development mode: Using proxy (relative URLs)
[API] GET /users
[AuthContext] Fetching users for login...
[AuthContext] Users loaded: 3 users
```

Nếu thấy lỗi:
```
[API] Error: Network Error
[API] No response received
```

→ Có thể là:
- JSON Server chưa chạy
- Lỗi CORS
- Port bị chiếm dụng

## Liên hệ

Nếu vẫn gặp lỗi sau khi thử các giải pháp trên, vui lòng:
1. Kiểm tra console logs
2. Kiểm tra Network tab trong Developer Tools
3. Cung cấp thông tin lỗi chi tiết

