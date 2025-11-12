import React from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number(value) || 0
  );

const ExpenseTable = () => {
  const { expenses, loading, error, totalAmount, deleteExpense } = useExpense();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Do you realy want to delete this Expense?');
    if (!shouldDelete) return;
    try {
      await deleteExpense(id);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Expense Management</h5>
        <Badge bg="primary" pill>
          Total: {formatCurrency(totalAmount)}
        </Badge>
      </div>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có dữ liệu Expense
              </td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={expense.id || index}>
                <td>{index + 1}</td>
                <td>{expense.name || '-'}</td>
                <td>{expense.category || '-'}</td>
                <td>{formatCurrency(expense.amount)}</td>
                <td>{expense.date ? new Date(expense.date).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/expenses/${expense.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => navigate(`/expenses/${expense.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
