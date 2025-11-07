/**
 * ConfirmModal.jsx - Component Modal thông báo xác nhận
 * 
 * Mục đích:
 * - Hiển thị modal thông báo với title và message
 * - Được sử dụng để hiển thị thông báo thành công hoặc thông tin quan trọng
 * - Component tái sử dụng được, có thể dùng ở nhiều nơi khác nhau
 * 
 * Props:
 * - show (boolean): Hiển thị/ẩn modal (true = hiển thị, false = ẩn)
 * - title (string): Tiêu đề của modal (ví dụ: "Login Successful")
 * - message (string): Nội dung thông báo (ví dụ: "Welcome, tai login successful!")
 * 
 * Được sử dụng ở:
 * - LoginForm.jsx: Hiển thị modal "Login Successful" sau khi đăng nhập thành công
 * - Có thể được dùng ở bất kỳ component nào cần hiển thị modal thông báo
 * 
 * Cách sử dụng:
 * <ConfirmModal
 *   show={showModal}
 *   title="Success"
 *   message="Operation completed successfully!"
 * />
 */

// Tạo 1 ModalComponent sử dụng useReducer để dùng chung cho LoginForm và SignUpForm và hiển thị thông tin của form
import React from "react";
import { Modal, Card } from "react-bootstrap";

/**
 * ConfirmModal - Component Modal hiển thị thông báo
 * 
 * @param {boolean} show - Hiển thị/ẩn modal
 * @param {string} title - Tiêu đề của modal
 * @param {string} message - Nội dung thông báo
 * 
 * @returns {JSX.Element} Modal component với title và message
 */
export function ConfirmModal({ show, title, message }) {
  return (
    <>
      {/* Modal: Component từ React Bootstrap để hiển thị popup
          - show: Control hiển thị/ẩn modal (true = hiển thị, false = ẩn)
          - centered: Căn giữa modal trên màn hình */}
      <Modal show={show} centered>
        {/* Modal Header: Phần đầu của modal chứa title và nút đóng */}
        <Modal.Header closeButton>
          {/* Modal Title: Tiêu đề của modal (ví dụ: "Login Successful") */}
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        
        {/* Modal Body: Phần thân của modal chứa nội dung chính */}
        <Modal.Body>
          {/* Card: Component từ React Bootstrap để hiển thị nội dung trong một box có border */}
          <Card>
            <Card.Body>
              {/* Paragraph hiển thị message với style bold
                  message chứa nội dung thông báo (ví dụ: "Welcome, tai login successful!") */}
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

// Export default để tương thích với các import khác
export default ConfirmModal;