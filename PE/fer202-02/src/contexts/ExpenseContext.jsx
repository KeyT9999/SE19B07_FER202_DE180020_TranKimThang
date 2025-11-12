// ExpenseContext.jsx quản lý các thao tác CRUD và bộ lọc expenses
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  getExpenses as fetchExpensesApi,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
  getExpenseById,
} from '../services/api';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  filteredExpenses: [],
  filters: {
    searchTerm: '',
    name: '',
    category: '',
    sortBy: 'date_desc',
  },
  isLoading: false,
  error: null,
  totalAmount: 0,
};

const applyFiltersAndSort = (expenses, filters) => {
  let data = [...expenses];
  const term = filters.searchTerm.trim().toLowerCase();

  if (term) {
    data = data.filter(
      (expense) =>
        expense.name?.toLowerCase().includes(term) ||
        expense.category?.toLowerCase().includes(term)
    );
  }

  if (filters.name) {
    data = data.filter((expense) => expense.name === filters.name);
  }

  if (filters.category) {
    data = data.filter((expense) => expense.category === filters.category);
  }

  switch (filters.sortBy) {
    case 'category_asc':
      data.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
      break;
    case 'category_desc':
      data.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
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

  const totalAmount = data.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  return { filteredExpenses: data, totalAmount };
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS': {
      const { filteredExpenses, totalAmount } = applyFiltersAndSort(
        action.payload,
        state.filters
      );
      return {
        ...state,
        isLoading: false,
        expenses: action.payload,
        filteredExpenses,
        totalAmount,
        error: null,
      };
    }
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_PAYMENT': {
      const expenses = [...state.expenses, action.payload];
      const { filteredExpenses, totalAmount } = applyFiltersAndSort(expenses, state.filters);
      return { ...state, expenses, filteredExpenses, totalAmount };
    }
    case 'UPDATE_PAYMENT': {
      const expenses = state.expenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      );
      const { filteredExpenses, totalAmount } = applyFiltersAndSort(expenses, state.filters);
      return { ...state, expenses, filteredExpenses, totalAmount };
    }
    case 'DELETE_PAYMENT': {
      const expenses = state.expenses.filter((expense) => expense.id !== action.payload);
      const { filteredExpenses, totalAmount } = applyFiltersAndSort(expenses, state.filters);
      return { ...state, expenses, filteredExpenses, totalAmount };
    }
    case 'SET_FILTERS': {
      const filters = { ...state.filters, ...action.payload };
      const { filteredExpenses, totalAmount } = applyFiltersAndSort(state.expenses, filters);
      return { ...state, filters, filteredExpenses, totalAmount };
    }
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchExpensesApi();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error.message || 'Failed to load expenses' });
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (payload) => {
    const created = await createExpense(payload);
    dispatch({ type: 'ADD_PAYMENT', payload: created });
    return created;
  }, []);

  const updateExpense = useCallback(async (id, payload) => {
    const updated = await updateExpenseById(id, payload);
    dispatch({ type: 'UPDATE_PAYMENT', payload: updated });
    return updated;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await deleteExpenseById(id);
    dispatch({ type: 'DELETE_PAYMENT', payload: id });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: 'SET_FILTERS', payload });
  }, []);

  const getExpense = useCallback(
    async (id) => {
      const existing = state.expenses.find((expense) => String(expense.id) === String(id));
      if (existing) return existing;
      return getExpenseById(id);
    },
    [state.expenses]
  );

  const availableSemesters = useMemo(
    () => Array.from(new Set(state.expenses.map((expense) => expense.name).filter(Boolean))),
    [state.expenses]
  );

  const availableCourses = useMemo(
    () => Array.from(new Set(state.expenses.map((expense) => expense.category).filter(Boolean))),
    [state.expenses]
  );

  const contextValue = {
    expenses: state.filteredExpenses,
    allExpenses: state.expenses,
    filters: state.filters,
    totalAmount: state.totalAmount,
    loading: state.isLoading,
    error: state.error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    getExpense,
    availableSemesters,
    availableCourses,
  };

  return <ExpenseContext.Provider value={contextValue}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => useContext(ExpenseContext);
