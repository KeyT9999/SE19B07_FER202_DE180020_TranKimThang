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
import { useAuth } from './AuthContext.jsx';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  filteredExpenses: [],
  filters: {
    category: '',
    sortBy: 'date_desc',
  },
  isLoading: false,
  error: null,
  totalAmount: 0,
  filteredTotal: 0,
  selectedExpense: null,
};

const normalizeExpense = (expense) => ({
  ...expense,
  amount: Number(expense.amount ?? 0),
});

const calculateTotal = (expenses) =>
  expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);

const applyFiltersAndSort = (expenses, filters) => {
  let data = [...expenses];

  if (filters.category) {
    data = data.filter(
      (expense) => expense.category?.toLowerCase() === filters.category.toLowerCase()
    );
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

  const filteredTotal = calculateTotal(data);

  return { filteredExpenses: data, filteredTotal };
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return { ...initialState };
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS': {
      const expenses = action.payload.map(normalizeExpense);
      const { filteredExpenses, filteredTotal } = applyFiltersAndSort(expenses, state.filters);
      return {
        ...state,
        isLoading: false,
        expenses,
        filteredExpenses,
        totalAmount: calculateTotal(expenses),
        filteredTotal,
        error: null,
      };
    }
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_EXPENSE': {
      const expenses = [...state.expenses, normalizeExpense(action.payload)];
      const { filteredExpenses, filteredTotal } = applyFiltersAndSort(expenses, state.filters);
      return {
        ...state,
        expenses,
        filteredExpenses,
        totalAmount: calculateTotal(expenses),
        filteredTotal,
        selectedExpense: state.selectedExpense,
      };
    }
    case 'UPDATE_EXPENSE': {
      const updatedExpense = normalizeExpense(action.payload);
      const expenses = state.expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      );
      const { filteredExpenses, filteredTotal } = applyFiltersAndSort(expenses, state.filters);
      return {
        ...state,
        expenses,
        filteredExpenses,
        totalAmount: calculateTotal(expenses),
        filteredTotal,
        selectedExpense:
          state.selectedExpense && state.selectedExpense.id === updatedExpense.id
            ? updatedExpense
            : state.selectedExpense,
      };
    }
    case 'DELETE_EXPENSE': {
      const expenses = state.expenses.filter((expense) => expense.id !== action.payload);
      const { filteredExpenses, filteredTotal } = applyFiltersAndSort(expenses, state.filters);
      const shouldClear =
        state.selectedExpense && String(state.selectedExpense.id) === String(action.payload);
      return {
        ...state,
        expenses,
        filteredExpenses,
        totalAmount: calculateTotal(expenses),
        filteredTotal,
        selectedExpense: shouldClear ? null : state.selectedExpense,
      };
    }
    case 'SET_FILTERS': {
      const filters = { ...state.filters, ...action.payload };
      const { filteredExpenses, filteredTotal } = applyFiltersAndSort(state.expenses, filters);
      return { ...state, filters, filteredExpenses, filteredTotal };
    }
    case 'SET_SELECTED_EXPENSE':
      return { ...state, selectedExpense: action.payload ? normalizeExpense(action.payload) : null };
    case 'CLEAR_SELECTED_EXPENSE':
      return { ...state, selectedExpense: null };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = useCallback(async () => {
    if (!userId) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchExpensesApi({ userId });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error.message || 'Failed to load expenses' });
    }
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(
    async (payload) => {
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      const created = await createExpense({ ...payload, userId });
      dispatch({ type: 'ADD_EXPENSE', payload: created });
      return created;
    },
    [userId]
  );

  const updateExpense = useCallback(
    async (id, payload) => {
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      const updated = await updateExpenseById(id, { ...payload, userId });
      dispatch({ type: 'UPDATE_EXPENSE', payload: updated });
      return updated;
    },
    [userId]
  );

  const deleteExpense = useCallback(async (id) => {
    await deleteExpenseById(id);
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: 'SET_FILTERS', payload });
  }, []);

  const getExpense = useCallback(
    async (id) => {
      const existing = state.expenses.find((expense) => String(expense.id) === String(id));
      if (existing) {
        dispatch({ type: 'SET_SELECTED_EXPENSE', payload: existing });
        return existing;
      }
      const fetched = await getExpenseById(id);
      if (String(fetched.userId) !== String(userId)) {
        throw new Error('Expense not found for current user');
      }
      dispatch({ type: 'SET_SELECTED_EXPENSE', payload: fetched });
      return fetched;
    },
    [state.expenses, userId]
  );

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_EXPENSE' });
  }, []);

  const selectExpense = useCallback((expense) => {
    dispatch({ type: 'SET_SELECTED_EXPENSE', payload: expense });
  }, []);

  const availableCategories = useMemo(
    () => Array.from(new Set(state.expenses.map((expense) => expense.category).filter(Boolean))),
    [state.expenses]
  );

  const contextValue = {
    expenses: state.filteredExpenses,
    allExpenses: state.expenses,
    filters: state.filters,
    totalAmount: state.totalAmount,
    filteredTotal: state.filteredTotal,
    loading: state.isLoading,
    error: state.error,
    selectedExpense: state.selectedExpense,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    getExpense,
    selectExpense,
    clearSelection,
    availableCategories,
  };

  return <ExpenseContext.Provider value={contextValue}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => useContext(ExpenseContext);
