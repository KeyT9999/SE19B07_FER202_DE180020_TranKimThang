# React Restaurant Booking Website

Ứng dụng React để đặt bàn nhà hàng, sử dụng json-server làm backend.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

### 1. Chạy JSON Server (Backend)

Trong terminal đầu tiên:

```bash
npx json-server --watch db.json --port 3001
```

JSON Server sẽ chạy tại: http://localhost:3001

### 2. Chạy React App (Frontend)

Trong terminal thứ hai:

```bash
npm start
```

React App sẽ chạy tại: http://localhost:3000

## Cấu trúc dữ liệu

File `db.json` chứa các collections:
- **restaurants**: Danh sách nhà hàng
- **tables**: Bàn ăn (foreign key: restaurantId)
- **services**: Dịch vụ nhà hàng (foreign key: restaurantId)
- **bookings**: Đặt bàn (foreign key: restaurantId, customerId)
- **users**: Người dùng
- **customers**: Khách hàng

## API Endpoints

JSON Server tự động tạo các endpoints:

- `GET /restaurants` - Lấy tất cả nhà hàng
- `GET /restaurants/:id` - Lấy nhà hàng theo ID
- `GET /tables?restaurantId=:id` - Lấy bàn theo nhà hàng
- `GET /services?restaurantId=:id` - Lấy dịch vụ theo nhà hàng
- `GET /bookings` - Lấy tất cả bookings
- `GET /bookings?customerId=:id` - Lấy bookings theo customer
- `POST /bookings` - Tạo booking mới
- `PUT /bookings/:id` - Cập nhật booking
- `DELETE /bookings/:id` - Xóa booking

## Tính năng

- ✅ Home page với AI search
- ✅ Danh sách nhà hàng với search và filter
- ✅ Chi tiết nhà hàng
- ✅ Chọn bàn và dịch vụ
- ✅ Form đặt bàn với validation
- ✅ Kiểm tra tính khả dụng bàn
- ✅ Responsive design

## Công nghệ sử dụng

- React 19
- React Router DOM
- React Bootstrap
- Axios
- JSON Server
- Styled Components
- React Icons

## Lưu ý

- Đảm bảo JSON Server đang chạy trước khi chạy React app
- Dữ liệu trong db.json sẽ được cập nhật khi thực hiện POST/PUT/DELETE
- File db.json sẽ được tự động cập nhật bởi json-server
