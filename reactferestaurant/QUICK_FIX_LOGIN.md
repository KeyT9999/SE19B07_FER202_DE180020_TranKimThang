# Quick Fix: Lỗi "Không thể tải danh sách người dùng"

## Vấn đề
Lỗi đăng nhập: "Không thể tải danh sách người dùng. Vui lòng thử lại."

## Giải pháp nhanh (3 bước)

### Bước 1: Khởi động JSON Server với CORS enabled

Mở terminal và chạy:

```bash
cd reactferestaurant
npm run server
```

Bạn sẽ thấy:
```
✅ JSON Server is running on http://localhost:3001
🌐 CORS: Enabled
```

### Bước 2: Kiểm tra server đang chạy

Mở trình duyệt và truy cập:
**http://localhost:3001/users**

Nếu thấy dữ liệu JSON (danh sách users), server đang chạy đúng ✅

### Bước 3: Restart React App

1. Dừng React app (nếu đang chạy): `Ctrl+C`
2. Khởi động lại:
   ```bash
   npm start
   ```

3. Thử đăng nhập lại với:
   - Username: `tai`
   - Password: `123456`

## Kiểm tra Console

Mở Developer Tools (F12) và xem tab Console. Bạn sẽ thấy:

```
[API] Development mode: Using direct URL (http://localhost:3001)
[API] Make sure JSON server is running with CORS enabled: npm run server
[API] GET http://localhost:3001/users
[AuthContext] Fetching users for login...
[AuthContext] Users loaded: 3 users
```

Nếu thấy lỗi, kiểm tra:
- JSON Server có đang chạy không?
- Port 3001 có bị chiếm dụng không?
- CORS có được enable không?

## Vẫn gặp lỗi?

Xem file `TROUBLESHOOTING_LOGIN.md` để biết thêm chi tiết.

## Tóm tắt thay đổi

1. ✅ Cập nhật `src/services/api.js` để sử dụng direct URL với CORS (mặc định)
2. ✅ Thêm logging chi tiết để debug
3. ✅ Cải thiện error handling
4. ✅ Cập nhật `start-server.js` để hiển thị endpoint users
5. ✅ Tạo script `check-server.js` để kiểm tra server

## Lưu ý quan trọng

- **PHẢI** chạy JSON Server với CORS enabled: `npm run server`
- **KHÔNG** chạy `json-server` trực tiếp (có thể thiếu CORS)
- Restart React app sau khi thay đổi cấu hình

