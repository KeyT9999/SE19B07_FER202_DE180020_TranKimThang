import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext.jsx';

const initialFormState = {
  semester: '',
  course: '',
  amount: '',
  date: '',
  notes: '',
};

const AddPaymentPage = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const isEditing = Boolean(paymentId);

  const { addPayment, updatePayment, getPayment } = usePayment();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFormData(initialFormState);
      return;
    }

    const loadPayment = async () => {
      try {
        const payment = await getPayment(paymentId);
        setFormData({
          semester: payment.semester || '',
          course: payment.course || '',
          amount: payment.amount?.toString() || '',
          date: payment.date ? payment.date.slice(0, 10) : '',
          notes: payment.notes || '',
        });
      } catch (error) {
        setFormError(error.message || 'Không thể tải dữ liệu thanh toán.');
      }
    };

    loadPayment();
  }, [getPayment, paymentId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.semester.trim()) {
      nextErrors.semester = 'Semester is required.';
    }
    if (!formData.course.trim()) {
      nextErrors.course = 'Course name is required.';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      semester: formData.semester.trim(),
      course: formData.course.trim(),
      amount: Number(formData.amount),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      notes: formData.notes.trim(),
    };

    try {
      if (isEditing) {
        await updatePayment(paymentId, payload);
      } else {
        await addPayment(payload);
      }
      navigate('/home');
    } catch (error) {
      setFormError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="mb-0">{isEditing ? 'Cập nhật thanh toán' : 'Thêm thanh toán mới'}</h4>
            </Card.Header>
            <Card.Body>
              {formError && (
                <Alert variant="danger" className="mb-3">
                  {formError}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="semester">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    isInvalid={!!errors.semester}
                    placeholder="2024.1"
                  />
                  <Form.Control.Feedback type="invalid">{errors.semester}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="course">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    isInvalid={!!errors.course}
                    placeholder="Web Programming"
                  />
                  <Form.Control.Feedback type="invalid">{errors.course}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={handleChange}
                    isInvalid={!!errors.amount}
                    placeholder="1000"
                  />
                  <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm nếu có"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Payment' : 'Add Payment'}
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => navigate('/home')}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPaymentPage;
