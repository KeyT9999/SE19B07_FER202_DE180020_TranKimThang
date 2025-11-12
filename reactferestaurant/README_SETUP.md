# Hướng dẫn chạy JSON Server với CORS

## Vấn đề: Lỗi CORS khi gọi API từ React

Nếu bạn gặp lỗi "Network Error" hoặc "CORS" khi gọi API từ React app, có 2 cách giải quyết:

## Cách 1: Sử dụng Proxy (Khuyến nghị)

React app đã được cấu hình proxy trong `package.json`:
```json
"proxy": "http://localhost:3001"
```

**Không cần làm gì thêm**, proxy sẽ tự động xử lý CORS.

## Cách 2: Chạy JSON Server với CORS enabled

Nếu muốn gọi trực tiếp API (không qua proxy), chạy json-server với các option sau:

### Windows (PowerShell):
```powershell
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

### Mac/Linux:
```bash
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

### Hoặc cài đặt json-server globally và tạo script:

1. Cài đặt json-server:
```bash
npm install -g json-server
```

2. Tạo file `server.js` trong thư mục `reactferestaurant`:
```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  noCors: false,
  readOnly: false,
});

server.use(middlewares);
server.use(router);

server.listen(3001, '0.0.0.0', () => {
  console.log('JSON Server is running on http://localhost:3001');
});
```

3. Chạy server:
```bash
node server.js
```

## Kiểm tra JSON Server có chạy không

Mở trình duyệt và truy cập: http://localhost:3001/restaurants

Nếu thấy dữ liệu JSON, server đang chạy đúng.

## Troubleshooting

### Lỗi: "Cannot GET /restaurants"
- Kiểm tra file `db.json` có tồn tại không
- Kiểm tra file `db.json` có key "restaurants" không
- Kiểm tra JSON syntax có đúng không

### Lỗi: "Network Error" hoặc "CORS"
- Đảm bảo json-server đang chạy trên port 3001
- Kiểm tra proxy trong package.json
- Thử refresh browser (Ctrl+Shift+R hoặc Cmd+Shift+R)
- Kiểm tra console trong browser để xem lỗi chi tiết

### Lỗi: "ECONNREFUSED"
- Đảm bảo json-server đang chạy
- Kiểm tra port 3001 có bị chiếm bởi ứng dụng khác không
- Thử đổi port: `npx json-server --watch db.json --port 3002`

## Test API bằng curl

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3001/restaurants -Method GET

# Mac/Linux
curl http://localhost:3001/restaurants
```

Nếu thấy dữ liệu JSON, API đang hoạt động đúng.

