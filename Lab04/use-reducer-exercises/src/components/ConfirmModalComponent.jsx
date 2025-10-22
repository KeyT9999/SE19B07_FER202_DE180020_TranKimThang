import React, { useReducer, useImperativeHandle, forwardRef } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

// Initial state cho confirm modal
const initialState = {
  show: false,
  title: '',
  message: '',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy',
  variant: 'primary', // màu nút confirm
  isLoading: false,
  type: 'confirm' // 'confirm', 'success', 'error', 'warning'
};

// Reducer cho confirm modal
function confirmModalReducer(state, action) {
  switch (action.type) {
    case 'SHOW_CONFIRM':
      return {
        ...state,
        show: true,
        title: action.payload.title || 'Xác nhận',
        message: action.payload.message || '',
        confirmText: action.payload.confirmText || 'Xác nhận',
        cancelText: action.payload.cancelText || 'Hủy',
        variant: action.payload.variant || 'primary',
        type: action.payload.type || 'confirm',
        isLoading: false
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        show: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SHOW_SUCCESS':
      return {
        ...state,
        show: true,
        title: 'Thành công!',
        message: action.payload.message || 'Thao tác đã hoàn thành thành công.',
        confirmText: 'OK',
        cancelText: '',
        variant: 'success',
        type: 'success',
        isLoading: false
      };
    case 'SHOW_ERROR':
      return {
        ...state,
        show: true,
        title: 'Lỗi!',
        message: action.payload.message || 'Đã có lỗi xảy ra.',
        confirmText: 'OK',
        cancelText: '',
        variant: 'danger',
        type: 'error',
        isLoading: false
      };
    case 'SHOW_WARNING':
      return {
        ...state,
        show: true,
        title: 'Cảnh báo!',
        message: action.payload.message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: action.payload.confirmText || 'Tiếp tục',
        cancelText: action.payload.cancelText || 'Hủy',
        variant: 'warning',
        type: 'warning',
        isLoading: false
      };
    default:
      return state;
  }
}

const ConfirmModalComponent = forwardRef(({ onConfirm, onCancel }, ref) => {
  const [state, dispatch] = useReducer(confirmModalReducer, initialState);

  // Expose dispatch để component cha có thể sử dụng
  useImperativeHandle(ref, () => ({
    showConfirm: (payload) => dispatch({ type: 'SHOW_CONFIRM', payload }),
    showSuccess: (payload) => dispatch({ type: 'SHOW_SUCCESS', payload }),
    showError: (payload) => dispatch({ type: 'SHOW_ERROR', payload }),
    showWarning: (payload) => dispatch({ type: 'SHOW_WARNING', payload }),
    hide: () => dispatch({ type: 'HIDE_MODAL' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading })
  }));

  const handleConfirm = async () => {
    if (onConfirm) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await onConfirm();
        dispatch({ type: 'HIDE_MODAL' });
      } catch (error) {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ 
          type: 'SHOW_ERROR', 
          payload: { message: error.message || 'Có lỗi xảy ra!' } 
        });
      }
    } else {
      dispatch({ type: 'HIDE_MODAL' });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch({ type: 'HIDE_MODAL' });
  };

  const getAlertVariant = () => {
    switch (state.type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Modal show={state.show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{state.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant={getAlertVariant()}>
          {state.message}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        {state.cancelText && (
          <Button 
            variant="secondary" 
            onClick={handleCancel}
            disabled={state.isLoading}
          >
            {state.cancelText}
          </Button>
        )}
        <Button 
          variant={state.variant} 
          onClick={handleConfirm}
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Đang xử lý...' : state.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

ConfirmModalComponent.displayName = 'ConfirmModalComponent';

export default ConfirmModalComponent;
