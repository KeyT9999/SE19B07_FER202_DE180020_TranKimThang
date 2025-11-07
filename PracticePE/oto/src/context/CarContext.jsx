// Ngữ cảnh (Context) cho Cars: chia sẻ state danh sách xe + bộ lọc giá
import React, { createContext, useContext, useReducer } from 'react';

// Hai context: một cho state và một cho hàm dispatch
const CarStateContext = createContext(null);
const CarDispatchContext = createContext(null);

// Hình dạng state toàn cục cho module cars
const initialState = {
  cars: [],
  price: '',
};

// Reducer: nơi duy nhất thay đổi state dựa trên action
function carReducer(state, action) {
  switch (action.type) {
    case 'SET_CARS':
      return { ...state, cars: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    default:
      return state;
  }
}

// Provider: cung cấp state và dispatch cho các component con
export function CarProvider({ children, initial = initialState }) {
  const [state, dispatch] = useReducer(carReducer, initial);
  return (
    <CarStateContext.Provider value={state}>
      <CarDispatchContext.Provider value={dispatch}>
        {children}
      </CarDispatchContext.Provider>
    </CarStateContext.Provider>
  );
}

// Hook đọc state
export function useCarState() {
  const ctx = useContext(CarStateContext);
  if (ctx === null) throw new Error('useCarState must be used within CarProvider');
  return ctx;
}

// Hook đọc dispatch
export function useCarDispatch() {
  const ctx = useContext(CarDispatchContext);
  if (ctx === null) throw new Error('useCarDispatch must be used within CarProvider');
  return ctx;
}

