# Lab 6 — Redux, Redux Thunk, Redux Toolkit

## 1. Redux Thunk là gì? Vì sao không dùng trực tiếp trong reducer?
- **Redux Thunk** là một middleware cho phép dispatch các hàm (thunks) thay vì chỉ dispatch plain object. Bên trong thunk có thể thực hiện logic bất đồng bộ như gọi API, trì hoãn hoặc điều kiện hóa dispatch.
- **Vai trò**: tách riêng side-effect (gọi API, đọc ghi storage) khỏi reducer. Thunk có thể `dispatch` nhiều action (pending/success/failure) tùy theo kết quả bất đồng bộ.
- **Reducer không thể làm việc này** vì reducer phải là một pure function: (state, action) → newState. Pure reducer không được phép có side-effect hay trả về `Promise`, nên việc gọi API trực tiếp trong reducer sẽ phá vỡ tính dự đoán và debug time-travel của Redux.

## 2. Ba ưu điểm chính của Redux Toolkit so với Redux thuần
1. **Cấu hình tối thiểu**: `configureStore`, `createSlice`, `createAsyncThunk` giảm bớt boilerplate so với tự viết store, action types, action creators, switch-case reducers.
2. **Tích hợp sẵn best practices**: tự động bật Redux DevTools, middleware (`redux-thunk`), khả năng kiểm tra serializable state, gợi ý chuẩn hóa dữ liệu.
3. **Immer dưới hood**: cho phép viết logic cập nhật state như “mutate” trực tiếp nhưng vẫn tạo state immutably, giúp code ngắn gọn và ít lỗi.

## 3. Khác biệt giữa `createSlice` và `createReducer`
- `createReducer` giúp viết reducer với cú pháp builder/“mutating” nhưng vẫn cần bạn tự định nghĩa action type riêng.
- `createSlice` bao gói luôn: định nghĩa tên slice, initial state, reducers (tự sinh action creators và action types), đồng thời cho phép thêm `extraReducers`.
- Vì kết hợp toàn bộ pipeline (reducer + action creators) trong một hàm duy nhất, `createSlice` giúp code gọn, nhất quán và ít lỗi lặp nên được khuyến khích dùng.

## 4. Async Thunk cho Refund Payment
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const refundPayment = createAsyncThunk(
  'payments/refund',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Refund failed');
    }
  }
);
```
- Thunk tạo ra ba trạng thái tương ứng với lifecycle:
  - `pending`: action được dispatch ngay khi hàm thunk chạy → thường dùng để đặt `isLoading = true`.
  - `fulfilled`: trả về khi promise resolve → state cập nhật với dữ liệu hoàn tiền thành công.
  - `rejected`: xảy ra khi promise reject hoặc `rejectWithValue` được gọi → state ghi nhận lỗi và kết thúc loading.

## 5. Khởi tạo state users và createSlice
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});

export default usersSlice.reducer;
```

## 6. Vận dụng
### Bài tập 1 – Users Slice & Async Thunk
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await api.get('/api/users');
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to load users');
  }
});

const initialState = {
  list: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleAdminStatus(state, action) {
      const user = state.list.find((u) => u.id === action.payload);
      if (user) {
        user.role = user.role === 'admin' ? 'student' : 'admin';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Không thể tải người dùng';
      });
  },
});

export const { toggleAdminStatus } = usersSlice.actions;
export default usersSlice.reducer;
```

### Bài tập 2 – Payments Slice với async thunk & selector
```javascript
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createPayment = createAsyncThunk(
  'payments/create',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post('/api/payments', payload);
      return data;
    } catch (error) {
      if (error.response?.status === 402) {
        return rejectWithValue('Tài khoản không đủ tiền');
      }
      return rejectWithValue(error.message || 'Không thể tạo thanh toán');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const selectPayments = (state) => state.payments.list;
export const selectSuccessfulPayments = createSelector(selectPayments, (payments) =>
  payments.filter((payment) => payment.status === 'SUCCESS')
);

export default paymentsSlice.reducer;
```

## 7. Nâng cao
- Áp dụng Redux Toolkit cho ứng dụng quản lý users/payments trong Progress Test 2 bằng cách:
  1. Tổ chức lại theo `features/` + `store/`.
  2. Tạo các slice cho từng nghiệp vụ kèm async thunks.
  3. Dùng selectors memoized (`createSelector`) cho dữ liệu dẫn xuất như tổng số thanh toán, danh sách thanh toán thành công.
  4. Kết hợp `useSelector`/`useDispatch` ở component, loại bỏ Context cũ để đồng bộ chuẩn RTK.


