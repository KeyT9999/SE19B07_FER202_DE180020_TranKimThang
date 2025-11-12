import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import {
  createPayment as createPaymentApi,
  deletePaymentById,
  getPaymentById,
  getPayments,
  updatePaymentById,
} from '../../services/api';

const initialState = {
  list: [],
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    semester: '',
    course: '',
    sortBy: 'date_desc',
  },
};

const handleErrorMessage = (error) =>
  error?.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPayments();
      return data;
    } catch (error) {
      return rejectWithValue(handleErrorMessage(error));
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createPaymentApi(payload);
      return data;
    } catch (error) {
      if (error?.response?.status === 402) {
        return rejectWithValue('Tài khoản không đủ tiền');
      }
      return rejectWithValue(handleErrorMessage(error));
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updatePaymentById(id, data);
      return updated;
    } catch (error) {
      return rejectWithValue(handleErrorMessage(error));
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deletePaymentById(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleErrorMessage(error));
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getPaymentById(id);
      return data;
    } catch (error) {
      return rejectWithValue(handleErrorMessage(error));
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((payment) => payment.id !== action.payload);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        const exists = state.list.find((payment) => String(payment.id) === String(action.payload.id));
        if (exists) {
          Object.assign(exists, action.payload);
        } else {
          state.list.push(action.payload);
        }
      });
  },
});

export const { setFilters } = paymentsSlice.actions;

export const selectPaymentsState = (state) => state.payments;
export const selectPaymentsList = (state) => state.payments.list;
export const selectPaymentsLoading = (state) => state.payments.isLoading;
export const selectPaymentsError = (state) => state.payments.error;
export const selectPaymentsFilters = (state) => state.payments.filters;

const applyFiltersAndSort = (payments, filters) => {
  let data = [...payments];
  const term = filters.searchTerm.trim().toLowerCase();

  if (term) {
    data = data.filter(
      (payment) =>
        payment.semester?.toLowerCase().includes(term) ||
        payment.courseName?.toLowerCase().includes(term)
    );
  }

  if (filters.semester) {
    data = data.filter((payment) => payment.semester === filters.semester);
  }

  if (filters.course) {
    data = data.filter((payment) => payment.courseName === filters.course);
  }

  switch (filters.sortBy) {
    case 'course_asc':
      data.sort((a, b) => (a.courseName || '').localeCompare(b.courseName || ''));
      break;
    case 'course_desc':
      data.sort((a, b) => (b.courseName || '').localeCompare(a.courseName || ''));
      break;
    case 'date_asc':
      data.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      break;
    case 'date_desc':
      data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      break;
    case 'amount_asc':
      data.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
      break;
    case 'amount_desc':
      data.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
      break;
    default:
      break;
  }

  return data;
};

export const selectFilteredPayments = createSelector(
  [selectPaymentsList, selectPaymentsFilters],
  (payments, filters) => applyFiltersAndSort(payments, filters)
);

export const selectTotalAmount = createSelector([selectFilteredPayments], (payments) =>
  payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
);

export const selectAvailableSemesters = createSelector([selectPaymentsList], (payments) =>
  Array.from(new Set(payments.map((payment) => payment.semester).filter(Boolean)))
);

export const selectAvailableCourses = createSelector([selectPaymentsList], (payments) =>
  Array.from(new Set(payments.map((payment) => payment.courseName).filter(Boolean)))
);

export const selectPaymentById = (state, id) =>
  state.payments.list.find((payment) => String(payment.id) === String(id));

export const selectSuccessfulPayments = createSelector([selectPaymentsList], (payments) =>
  payments.filter((payment) => payment.status === 'SUCCESS')
);

export default paymentsSlice.reducer;

