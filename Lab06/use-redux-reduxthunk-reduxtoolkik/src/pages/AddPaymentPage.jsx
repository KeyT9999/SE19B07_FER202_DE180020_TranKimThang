import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createPayment as createPaymentThunk,
  fetchPaymentById,
  selectPaymentById,
  selectPaymentsLoading,
  updatePayment as updatePaymentThunk,
} from '../features/payments/paymentsSlice';

const initialFormState = {
  semester: '',
  course: '',
  amount: '',
  date: '',
  notes: '',
};

const AddPaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentId } = useParams();
  const isEditing = Boolean(paymentId);

  const payment = useSelector((state) => selectPaymentById(state, paymentId));
  const isLoading = useSelector(selectPaymentsLoading);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPayment, setIsFetchingPayment] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFormData(initialFormState);
      return;
    }

    if (payment) {
      setFormData({
        semester: payment.semester || '',
        course: payment.courseName || '',
        amount: payment.amount?.toString() || '',
        date: payment.date ? payment.date.slice(0, 10) : '',
        notes: payment.notes || '',
      });
      return;
    }

    let active = true;
    setIsFetchingPayment(true);
    dispatch(fetchPaymentById(paymentId))
      .unwrap()
      .then((data) => {
        if (!active) return;
        setFormData({
          semester: data.semester || '',
          course: data.courseName || '',
          amount: data.amount?.toString() || '',
          date: data.date ? data.date.slice(0, 10) : '',
          notes: data.notes || '',
        });
      })
      .catch((error) => {
        if (!active) return;
        setFormError(error || 'Không thể tải dữ liệu thanh toán.');
      })
      .finally(() => {
        if (active) {
          setIsFetchingPayment(false);
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, isEditing, payment, paymentId]);

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
    setFormError('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      semester: formData.semester.trim(),
      courseName: formData.course.trim(),
      amount: Number(formData.amount),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      notes: formData.notes.trim(),
    };

    try {
      let action;
      if (isEditing) {
        action = await dispatch(updatePaymentThunk({ id: paymentId, data: payload }));
      } else {
        action = await dispatch(createPaymentThunk(payload));
      }

      if (createPaymentThunk.rejected.match(action) || updatePaymentThunk.rejected.match(action)) {
        setFormError(action.payload || 'Có lỗi xảy ra. Vui lòng thử lại.');
      } else {
        navigate('/home');
      }
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
              {isFetchingPayment && (
                <div className="text-center my-3">
                  <Spinner animation="border" role="status" />
                </div>
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
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || isLoading || isFetchingPayment}
                  >
                    {isSubmitting || isLoading
                      ? 'Saving...'
                      : isEditing
                      ? 'Update Payment'
                      : 'Add Payment'}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate('/home')}
                    disabled={isSubmitting || isLoading}
                  >
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
