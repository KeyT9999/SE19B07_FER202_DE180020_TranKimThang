//ConfirmModal.jsx được dùng để hiển thị một modal xác nhận hành động
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
const ConfirmModal = ({ show, title, message, onConfirm }) => {
    return (
        <Modal show={show} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onConfirm}>
                    Xác nhận    
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;