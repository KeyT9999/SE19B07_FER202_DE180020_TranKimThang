// PaymentContext.jsx quản lý các thao tác CRUD và bộ lọc payments
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  getPayments as fetchPaymentsApi,
  createPayment,
  updatePaymentById,
  deletePaymentById,
  getPaymentById,
} from '../services/api';

const PaymentContext = createContext();

const initialState = {
  payments: [],
  filteredPayments: [],
  filters: {
    searchTerm: '',
    semester: '',
    course: '',
    sortBy: 'date_desc',
  },
  isLoading: false,
  error: null,
  totalAmount: 0,
};

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

  const totalAmount = data.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return { filteredPayments: data, totalAmount };
};

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS': {
      const { filteredPayments, totalAmount } = applyFiltersAndSort(
        action.payload,
        state.filters
      );
      return {
        ...state,
        isLoading: false,
        payments: action.payload,
        filteredPayments,
        totalAmount,
        error: null,
      };
    }
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_PAYMENT': {
      const payments = [...state.payments, action.payload];
      const { filteredPayments, totalAmount } = applyFiltersAndSort(payments, state.filters);
      return { ...state, payments, filteredPayments, totalAmount };
    }
    case 'UPDATE_PAYMENT': {
      const payments = state.payments.map((payment) =>
        payment.id === action.payload.id ? action.payload : payment
      );
      const { filteredPayments, totalAmount } = applyFiltersAndSort(payments, state.filters);
      return { ...state, payments, filteredPayments, totalAmount };
    }
    case 'DELETE_PAYMENT': {
      const payments = state.payments.filter((payment) => payment.id !== action.payload);
      const { filteredPayments, totalAmount } = applyFiltersAndSort(payments, state.filters);
      return { ...state, payments, filteredPayments, totalAmount };
    }
    case 'SET_FILTERS': {
      const filters = { ...state.filters, ...action.payload };
      const { filteredPayments, totalAmount } = applyFiltersAndSort(state.payments, filters);
      return { ...state, filters, filteredPayments, totalAmount };
    }
    default:
      return state;
  }
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const fetchPayments = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchPaymentsApi();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error.message || 'Failed to load payments' });
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const addPayment = useCallback(async (payload) => {
    const created = await createPayment(payload);
    dispatch({ type: 'ADD_PAYMENT', payload: created });
    return created;
  }, []);

  const updatePayment = useCallback(async (id, payload) => {
    const updated = await updatePaymentById(id, payload);
    dispatch({ type: 'UPDATE_PAYMENT', payload: updated });
    return updated;
  }, []);

  const deletePayment = useCallback(async (id) => {
    await deletePaymentById(id);
    dispatch({ type: 'DELETE_PAYMENT', payload: id });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: 'SET_FILTERS', payload });
  }, []);

  const getPayment = useCallback(
    async (id) => {
      const existing = state.payments.find((payment) => String(payment.id) === String(id));
      if (existing) return existing;
      return getPaymentById(id);
    },
    [state.payments]
  );

  const availableSemesters = useMemo(
    () => Array.from(new Set(state.payments.map((payment) => payment.semester).filter(Boolean))),
    [state.payments]
  );

  const availableCourses = useMemo(
    () => Array.from(new Set(state.payments.map((payment) => payment.courseName).filter(Boolean))),
    [state.payments]
  );

  const contextValue = {
    payments: state.filteredPayments,
    allPayments: state.payments,
    filters: state.filters,
    totalAmount: state.totalAmount,
    loading: state.isLoading,
    error: state.error,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
    setFilters,
    getPayment,
    availableSemesters,
    availableCourses,
  };

  return <PaymentContext.Provider value={contextValue}>{children}</PaymentContext.Provider>;
};

export const usePayment = () => useContext(PaymentContext);
