import { useReducer, useEffect } from "react";

const usePersistentReducer = (reducer, initialState, storageKey) => {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : initial;
    } catch (error) {
      return initial;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, dispatch];
};

export default usePersistentReducer;
