import React from 'react';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useExpense } from '../contexts/ExpenseContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

const ExpenseTable = () => {
  const { expenses, loading, error, deleteExpense, selectExpense, selectedExpense } = useExpense();

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Do you really want to delete this expense?');
    if (!confirmed) {
      return;
    }
    try {
      await deleteExpense(id);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Header as="h5">Expense Management</Card.Header>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header as="h5">Expense Management</Card.Header>
      <Card.Body className="p-0">
        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={{ width: '60px' }}>
                  #
                </th>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-center" style={{ width: '160px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No expenses found. Start by adding a new one.
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => {
                  const isActive =
                    selectedExpense && String(selectedExpense.id) === String(expense.id);
                  return (
                    <tr key={expense.id || index} className={isActive ? 'table-active' : ''}>
                      <td className="text-center">{index + 1}</td>
                      <td>{expense.name || '-'}</td>
                      <td>{formatCurrency(expense.amount)}</td>
                      <td>{expense.category || '-'}</td>
                      <td>{formatDate(expense.date)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => selectExpense(expense)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpenseTable;
