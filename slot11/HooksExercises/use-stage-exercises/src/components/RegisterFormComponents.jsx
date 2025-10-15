// src/components/RegisterForm.jsx
import { useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Toast, ToastContainer, Modal,
} from "react-bootstrap";

const initialForm = { username: "", email: "", password: "", confirm: "" };

const validate = {
  username: (v) =>
    v.trim().length === 0
      ? "Username is required"
      : !/^[A-Za-z0-9._]{3,}$/.test(v.trim())
      ? "Username ≥3, chỉ chữ/số/._"
      : "",
  email: (v) =>
    v.trim().length === 0
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? "Email không hợp lệ"
      : "",
  password: (v) =>
    v.length === 0
      ? "Password is required"
      : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(v)
      ? "≥8 ký tự, có hoa, thường, số, ký tự đặc biệt"
      : "",
  confirm: (v, f) =>
    v.length === 0 ? "Confirm is required" : v !== f.password ? "Không khớp password" : "",
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialForm);                 // object form
  const [errors, setErrors] = useState({});                      // object lỗi
  const [showToast, setShowToast] = useState(false);             // toast trạng thái
  const [showModal, setShowModal] = useState(false);             // modal kết quả

  const getAllErrors = (f) => ({
    username: validate.username(f.username),
    email: validate.email(f.email),
    password: validate.password(f.password),
    confirm: validate.confirm(f.confirm, f),
  });

  const isFormValid = (f) => {
    const errs = getAllErrors(f);
    return Object.values(errs).every((e) => e === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // tránh khoảng trắng đầu/cuối cho username/email khi validate
    const next = { ...form, [name]: value };
    setForm(next);

    // validate trường đang đổi + (nếu đổi password) thì validate lại confirm
    const fieldErr =
      name === "confirm" ? validate.confirm(value, next)
      : name === "password" ? validate.password(value)
      : validate[name](value);

    setErrors((prev) => {
      const updated = { ...prev, [name]: fieldErr };
      if (name === "password") {
        updated.confirm = validate.confirm(next.confirm, next);
      }
      // loại bỏ key nếu không còn lỗi (để Form.Control isInvalid gọn)
      Object.keys(updated).forEach((k) => !updated[k] && delete updated[k]);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrs = getAllErrors(form);
    setErrors(() => {
      const cleaned = { ...allErrs };
      Object.keys(cleaned).forEach((k) => !cleaned[k] && delete cleaned[k]);
      return cleaned;
    });
    if (Object.values(allErrs).every((x) => x === "")) {
      setShowToast(true);
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors({});
  };

  const valid = isFormValid(form);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="text-center">
              <h3 className="m-0">Register</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="vd: john.doe_01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="vd: you@example.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="••••••••"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirm">
                      <Form.Label>Confirm password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm"
                        value={form.confirm}
                        onChange={handleChange}
                        isInvalid={!!errors.confirm}
                        placeholder="nhập lại mật khẩu"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirm}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" className="flex-fill" disabled={!valid}>
                    Submit
                  </Button>
                  <Button type="button" variant="outline-secondary" className="flex-fill" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Toast báo thành công */}
      <ToastContainer position="top-center" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white text-center">Submitted successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Modal hiển thị dữ liệu đã submit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đăng ký thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Thông tin tài khoản</h5>
              <p className="mb-1"><strong>Username:</strong> {form.username}</p>
              <p className="mb-0"><strong>Email:</strong> {form.email}</p>
              {/* Không hiển thị password vì lý do bảo mật */}
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
