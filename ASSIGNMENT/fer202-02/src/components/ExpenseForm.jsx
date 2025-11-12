import React, { useEffect, useMemo, useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const defaultFormState = {
  name: '',
  amount: '',
  category: '',
  date: '',
};

const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toISOString = (value) => {
  if (!value) {
    return new Date().toISOString();
  }
  const [year, month, day] = value.split('-').map(Number);
  const isoDate = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return isoDate.toISOString();
};

const ExpenseForm = () => {
  const {
    selectedExpense,
    addExpense,
    updateExpense,
    clearSelection,
    availableCategories,
  } = useExpense();

  const [formData, setFormData] = useState(defaultFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(selectedExpense);

  const categorySuggestions = useMemo(
    () => Array.from(new Set([...availableCategories, formData.category].filter(Boolean))),
    [availableCategories, formData.category]
  );

  useEffect(() => {
    if (selectedExpense) {
      setFormData({
        name: selectedExpense.name || '',
        amount: selectedExpense.amount?.toString() || '',
        category: selectedExpense.category || '',
        date: toInputDate(selectedExpense.date),
      });
      setSubmitMessage('');
    } else {
      setFormData(defaultFormState);
    }
    setFieldErrors({});
    setSubmitError('');
  }, [selectedExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
    setSubmitMessage('');
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required.';
    }
    const amountValue = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      errors.amount = 'Amount must be a number greater than 0.';
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      amount: Number(formData.amount),
      date: toISOString(formData.date),
    };

    try {
      if (isEditing && selectedExpense) {
        await updateExpense(selectedExpense.id, payload);
        setSubmitMessage('Expense updated successfully.');
        clearSelection();
      } else {
        await addExpense(payload);
        setSubmitMessage('Expense added successfully.');
        setFormData(defaultFormState);
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormState);
    setFieldErrors({});
    setSubmitError('');
    setSubmitMessage('');
    clearSelection();
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header as="h5">{isEditing ? 'Edit Expense' : 'Add Expense'}</Card.Header>
      <Card.Body>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}
        {submitMessage && (
          <Alert variant="success" className="mb-3">
            {submitMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="expenseName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter expense name"
              isInvalid={!!fieldErrors.name}
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="expenseAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              isInvalid={!!fieldErrors.amount}
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.amount}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="expenseCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              name="category"
              list="expense-category-suggestions"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select category"
              isInvalid={!!fieldErrors.category}
            />
            <datalist id="expense-category-suggestions">
              {categorySuggestions.map((category) => (
                <option value={category} key={category} />
              ))}
            </datalist>
            <Form.Control.Feedback type="invalid">{fieldErrors.category}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="expenseDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" type="button" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save' : 'Add expense'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ExpenseForm;

