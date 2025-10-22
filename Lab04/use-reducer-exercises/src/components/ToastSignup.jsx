import React, { useReducer, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Initial state cho toast
const initialState = {
  show: false,
  message: '',
  type: 'success', // 'success', 'error', 'warning', 'info'
  title: '',
  delay: 3000,
  position: 'top-end' // 'top-start', 'top-center', 'top-end', 'middle-start', 'middle-center', 'middle-end', 'bottom-start', 'bottom-center', 'bottom-end'
};

// Reducer cho toast
function toastReducer(state, action) {
  switch (action.type) {
    case 'SHOW_TOAST':
      return {
        ...state,
        show: true,
        message: action.payload.message || '',
        type: action.payload.type || 'success',
        title: action.payload.title || '',
        delay: action.payload.delay || 3000,
        position: action.payload.position || 'top-end'
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        show: false
      };
    case 'SHOW_SUCCESS':
      return {
        ...state,
        show: true,
        message: action.payload.message || 'Thành công!',
        type: 'success',
        title: action.payload.title || 'Success',
        delay: action.payload.delay || 3000,
        position: action.payload.position || 'top-end'
      };
    case 'SHOW_ERROR':
      return {
        ...state,
        show: true,
        message: action.payload.message || 'Đã có lỗi xảy ra!',
        type: 'error',
        title: action.payload.title || 'Error',
        delay: action.payload.delay || 4000,
        position: action.payload.position || 'top-end'
      };
    case 'SHOW_WARNING':
      return {
        ...state,
        show: true,
        message: action.payload.message || 'Cảnh báo!',
        type: 'warning',
        title: action.payload.title || 'Warning',
        delay: action.payload.delay || 3500,
        position: action.payload.position || 'top-end'
      };
    case 'SHOW_INFO':
      return {
        ...state,
        show: true,
        message: action.payload.message || 'Thông tin',
        type: 'info',
        title: action.payload.title || 'Info',
        delay: action.payload.delay || 3000,
        position: action.payload.position || 'top-end'
      };
    default:
      return state;
  }
}

const ToastSignup = React.forwardRef(({ onClose }, ref) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Expose dispatch để component cha có thể sử dụng
  React.useImperativeHandle(ref, () => ({
    showToast: (payload) => dispatch({ type: 'SHOW_TOAST', payload }),
    showSuccess: (payload) => dispatch({ type: 'SHOW_SUCCESS', payload }),
    showError: (payload) => dispatch({ type: 'SHOW_ERROR', payload }),
    showWarning: (payload) => dispatch({ type: 'SHOW_WARNING', payload }),
    showInfo: (payload) => dispatch({ type: 'SHOW_INFO', payload }),
    hide: () => dispatch({ type: 'HIDE_TOAST' })
  }));

  // Auto hide toast sau delay
  useEffect(() => {
    if (state.show) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, state.delay);
      
      return () => clearTimeout(timer);
    }
  }, [state.show, state.delay]);

  const handleClose = () => {
    dispatch({ type: 'HIDE_TOAST' });
    if (onClose) {
      onClose();
    }
  };

  const getToastVariant = () => {
    switch (state.type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'success';
    }
  };

  const getToastIcon = () => {
    switch (state.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  };

  const getToastBgColor = () => {
    switch (state.type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#d4edda';
    }
  };

  const getToastTextColor = () => {
    switch (state.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#155724';
    }
  };

  return (
    <ToastContainer
      position={state.position}
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      <Toast
        show={state.show}
        onClose={handleClose}
        delay={state.delay}
        autohide
        style={{
          minWidth: '300px',
          backgroundColor: getToastBgColor(),
          color: getToastTextColor(),
          border: `1px solid ${state.type === 'success' ? '#c3e6cb' : 
                              state.type === 'error' ? '#f5c6cb' : 
                              state.type === 'warning' ? '#ffeaa7' : '#bee5eb'}`
        }}
      >
        <Toast.Header
          closeButton
          style={{
            backgroundColor: getToastBgColor(),
            borderBottom: `1px solid ${state.type === 'success' ? '#c3e6cb' : 
                                        state.type === 'error' ? '#f5c6cb' : 
                                        state.type === 'warning' ? '#ffeaa7' : '#bee5eb'}`
          }}
        >
          <strong className="me-auto" style={{ color: getToastTextColor() }}>
            {getToastIcon()} {state.title}
          </strong>
        </Toast.Header>
        <Toast.Body style={{ color: getToastTextColor() }}>
          {state.message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
});

ToastSignup.displayName = 'ToastSignup';

export default ToastSignup;
