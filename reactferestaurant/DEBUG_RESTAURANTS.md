# Hướng dẫn Debug trang Restaurants

## Bước 1: Kiểm tra JSON Server có chạy không

1. Mở terminal trong thư mục `reactferestaurant`
2. Chạy lệnh:
   ```bash
   npx json-server --watch db.json --port 3001
   ```
3. Bạn sẽ thấy thông báo:
   ```
   \{^_^}/ hi!

   Loading db.json
   Done

   Resources
   http://localhost:3001/restaurants
   http://localhost:3001/tables
   http://localhost:3001/services
   ...
   ```

## Bước 2: Kiểm tra API trực tiếp

Mở trình duyệt và truy cập: **http://localhost:3001/restaurants**

Bạn sẽ thấy dữ liệu JSON của 8 nhà hàng. Nếu không thấy, có nghĩa là:
- JSON Server chưa chạy đúng
- File `db.json` có lỗi syntax
- Port 3001 đã bị chiếm bởi ứng dụng khác

## Bước 3: Kiểm tra React App

1. Đảm bảo React app đang chạy: `npm start`
2. Mở trang: **http://localhost:3000/restaurants**
3. Mở Console (F12) để xem logs

## Bước 4: Kiểm tra Console Logs

Trong Console, bạn sẽ thấy các log như sau:

### Nếu thành công:
```
[API] GET http://localhost:3001/restaurants
[API] Response 200 from /restaurants
[API] Response data type: object Array
[API] Response data length: 8
[getAllRestaurants] Success: Returning 8 restaurants
[RestaurantsPage] Data received: { type: 'object', isArray: true, length: 8, ... }
[RestaurantsPage] Setting 8 restaurants
[applyFilters] Starting with: { dataLength: 8, search: '', cuisine: '', ... }
[applyFilters] Final results: 8
[RestaurantList] Rendering 8 restaurants
```

### Nếu có lỗi:
```
[API] Error Details
Error message: Network Error
Error code: ERR_NETWORK
...
```

## Bước 5: Debug Info trên trang

Trên trang restaurants, bạn sẽ thấy một box "Debug Info" hiển thị:
- Loading: Yes/No
- Error: Yes/No  
- Restaurants: số lượng
- Filtered: số lượng đã lọc

## Các lỗi thường gặp và cách khắc phục

### Lỗi: "Network Error" hoặc "ERR_NETWORK"
**Nguyên nhân:** JSON Server chưa chạy hoặc không thể kết nối
**Giải pháp:**
1. Kiểm tra json-server có đang chạy không
2. Kiểm tra port 3001 có bị chiếm không
3. Thử restart json-server

### Lỗi: "ECONNREFUSED"
**Nguyên nhân:** Không thể kết nối đến server
**Giải pháp:**
1. Đảm bảo json-server đang chạy trên port 3001
2. Kiểm tra firewall có chặn không

### Lỗi: "404 Not Found"
**Nguyên nhân:** Endpoint không tồn tại
**Giải pháp:**
1. Kiểm tra file `db.json` có key "restaurants" không
2. Kiểm tra JSON syntax có đúng không

### Lỗi: "CORS"
**Nguyên nhân:** CORS bị chặn
**Giải pháp:**
1. JSON Server mặc định có CORS enabled
2. Nếu vẫn lỗi, thử dùng proxy trong package.json

## Test nhanh

1. Mở terminal và chạy:
   ```bash
   curl http://localhost:3001/restaurants
   ```
   Hoặc trên Windows PowerShell:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3001/restaurants
   ```

2. Nếu thấy dữ liệu JSON, API đang hoạt động đúng

## Nếu vẫn không hoạt động

1. Kiểm tra tất cả logs trong Console (F12)
2. Copy toàn bộ error message
3. Kiểm tra Network tab trong DevTools để xem request/response
4. Đảm bảo cả React app và JSON server đang chạy

## Lưu ý

- Debug Info chỉ hiển thị trong development mode
- Logs chỉ hiển thị trong Console, không hiển thị trên trang
- Đảm bảo cả hai server đang chạy: React (port 3000) và JSON Server (port 3001)

