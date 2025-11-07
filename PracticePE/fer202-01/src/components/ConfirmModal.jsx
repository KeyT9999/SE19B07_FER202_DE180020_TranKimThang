import React from "react";
import { Modal, Card } from "react-bootstrap";
import PropTypes from "prop-types";

export function ConfirmModal({ show, title, message }) {
  return (
    <>
      <Modal show={show} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <p>
                <strong>{message}</strong>
              </p>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmModal;

