import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const initialFormState = {
  name: '',
  category: '',
  amount: '',
  date: '',
  notes: '',
};

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const isEditing = Boolean(expenseId);

  const { addExpense, updateExpense, getExpense } = useExpense();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFormData(initialFormState);
      return;
    }

    const loadExpense = async () => {
      try {
        const expense = await getExpense(expenseId);
        setFormData({
          name: expense.name || '',
          category: expense.category || '',
          amount: expense.amount?.toString() || '',
          date: expense.date ? expense.date.slice(0, 10) : '',
          notes: expense.notes || '',
        });
      } catch (error) {
        setFormError(error.message || 'Không thể tải dữ liệu Expense.');
      }
    };

    loadExpense();
  }, [getExpense, expenseId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    if (!formData.category.trim()) {
      nextErrors.category = 'Category name is required.';
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
      name: formData.name.trim(),
      category: formData.category.trim(),
      amount: Number(formData.amount),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      notes: formData.notes.trim(),
    };

    try {
      if (isEditing) {
        await updateExpense(expenseId, payload);
      } else {
        await addExpense(payload);
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
              <h4 className="mb-0">{isEditing ? 'Edit Expense' : 'Add Expense '}</h4>
            </Card.Header>
            <Card.Body>
              {formError && (
                <Alert variant="danger" className="mb-3">
                  {formError}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Internet Bill"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                    placeholder="Food"
                  />
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
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
                  <Form.Label>Expense Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </Form.Group>

              

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
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

export default AddExpensePage;
