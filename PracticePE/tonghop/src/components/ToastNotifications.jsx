import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useToast } from "../context/ToastContext";

const ToastNotifications = () => {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainer
      position="bottom-end"
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={toast.type}
          onClose={() => removeToast(toast.id)}
          delay={5000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotifications;
