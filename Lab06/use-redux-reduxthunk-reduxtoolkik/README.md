# Redux Toolkit Lab 06

Ứng dụng quản lý học phí được tái cấu trúc hoàn toàn sang **Redux Toolkit** + **Redux Thunk**. Dự án minh họa cách kết hợp async thunks, slices đồng bộ và selectors nhằm quản lý users/payments thống nhất.

## Nội dung chính

- Cấu hình store với `configureStore` và chia nhỏ theo `features/`.
- `authSlice` xử lý đăng nhập/đăng xuất, lưu user vào `localStorage`.
- `usersSlice` đọc danh sách người dùng, toggle role cục bộ.
- `paymentsSlice` quản lý CRUD thanh toán, bộ lọc, xử lý lỗi 402 bằng `rejectWithValue`.
- Selectors memoized (Reselect) cho tổng tiền, bộ dữ liệu lọc, và `selectSuccessfulPayments`.
- Toàn bộ components sử dụng `useSelector`/`useDispatch` thay cho Context API.

Xem thêm phần lý thuyết, ví dụ async thunk và selector trong [`docs/lab6.md`](docs/lab6.md).

## Cấu trúc thư mục

```
src/
  features/
    auth/
    users/
    payments/
  store/
    store.js
  components/
  pages/
  routes/
```

## Chạy dự án

```bash
npm install
npm start
```

Ứng dụng chạy ở `http://localhost:3000`. Cấu hình API giả định JSON Server tại `http://localhost:3001` (xem `src/services/api.js`).

## Kiểm thử đề xuất

- Đăng nhập/đăng xuất và kiểm tra lưu/clear user.
- Tải danh sách users, thử `Toggle Admin`, ban/unban (API mock).
- Thao tác CRUD thanh toán; kiểm tra lọc, sắp xếp, và thông báo lỗi 402 khi tạo mới.
- Dùng `selectSuccessfulPayments` trong devtools để xác nhận selector hoạt động.
