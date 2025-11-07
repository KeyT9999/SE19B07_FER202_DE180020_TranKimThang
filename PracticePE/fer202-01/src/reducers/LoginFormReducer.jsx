export const initialFormState = {
  identifier: "",
  password: "",
  errors: {},
  showSuccessModal: false,
};

export const loginFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    
    case "CLEAR_ERROR":
      const { [action.field]: _, ...rest } = state.errors;
      return { ...state, errors: rest };
    
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    
    case "RESET_FORM":
      return initialFormState;
    
    case "SHOW_SUCCESS_MODAL":
      return { ...state, showSuccessModal: true };
    
    case "HIDE_SUCCESS_MODAL":
      return { ...state, showSuccessModal: false };
    
    default:
      return state;
  }
};

