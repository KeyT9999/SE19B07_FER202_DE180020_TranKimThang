import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext.jsx';

const ExpenseDetailsPage = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const { getExpense } = useExpense();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await getExpense(expenseId);
        setExpense(data);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu Expense.');
      } finally {
        setLoading(false);
      }
    };
    loadExpense();
  }, [getExpense, expenseId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!expense) {
    return null;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Chi tiết Expense</h4>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {expense.name || '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Category:</strong> {expense.category || '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Amount:</strong>{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(Number(expense.amount) || 0)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date:</strong>{' '}
                  {expense.date ? new Date(expense.date).toLocaleDateString() : '-'}
                </ListGroup.Item>
                
              </ListGroup>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={() => navigate(`/expenses/${expense.id}/edit`)}>
                Chỉnh sửa
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpenseDetailsPage;
