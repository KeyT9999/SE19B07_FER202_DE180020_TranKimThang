import React, { createContext, useContext, useReducer } from "react";

const FavouriteContext = createContext();

const favouriteReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVOURITE":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "REMOVE_FROM_FAVOURITE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case "CLEAR_FAVOURITES":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
};

export function FavouriteProvider({ children }) {
  const [state, dispatch] = useReducer(favouriteReducer, initialState);

  const addToFavourite = (mobile) => {
    dispatch({ type: "ADD_TO_FAVOURITE", payload: mobile });
  };

  const removeFromFavourite = (id) => {
    dispatch({ type: "REMOVE_FROM_FAVOURITE", payload: { id } });
  };

  const clearFavourites = () => {
    dispatch({ type: "CLEAR_FAVOURITES" });
  };

  const isFavourite = (id) => {
    return state.items.some((item) => item.id === id);
  };

  const value = {
    items: state.items,
    addToFavourite,
    removeFromFavourite,
    clearFavourites,
    isFavourite,
  };

  return (
    <FavouriteContext.Provider value={value}>
      {children}
    </FavouriteContext.Provider>
  );
}

export function useFavourite() {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error("useFavourite must be used within a FavouriteProvider");
  }
  return context;
}

