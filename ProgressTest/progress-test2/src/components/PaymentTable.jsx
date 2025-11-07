import React from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number(value) || 0
  );

const PaymentTable = () => {
  const { payments, loading, error, totalAmount, deletePayment } = usePayment();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa khoản thanh toán này?');
    if (!shouldDelete) return;
    try {
      await deletePayment(id);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete payment');
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
        <h5 className="mb-0">Danh sách thanh toán</h5>
        <Badge bg="primary" pill>
          Total: {formatCurrency(totalAmount)}
        </Badge>
      </div>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Semester</th>
            <th>Course</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có dữ liệu thanh toán
              </td>
            </tr>
          ) : (
            payments.map((payment, index) => (
              <tr key={payment.id || index}>
                <td>{index + 1}</td>
                <td>{payment.semester || '-'}</td>
                <td>{payment.courseName || '-'}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{payment.date ? new Date(payment.date).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/payments/${payment.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => navigate(`/payments/${payment.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(payment.id)}
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

export default PaymentTable;
