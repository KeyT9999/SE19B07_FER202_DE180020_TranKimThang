import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPaymentById,
  selectPaymentById,
  selectPaymentsLoading,
} from '../features/payments/paymentsSlice';

const PaymentDetailsPage = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const paymentFromStore = useSelector((state) => selectPaymentById(state, paymentId));
  const isLoadingGlobal = useSelector(selectPaymentsLoading);

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPayment = async () => {
      try {
        if (paymentFromStore) {
          setPayment(paymentFromStore);
        } else {
          const data = await dispatch(fetchPaymentById(paymentId)).unwrap();
          setPayment(data);
        }
      } catch (err) {
        const message = typeof err === 'string' ? err : err.message;
        setError(message || 'Không thể tải dữ liệu thanh toán.');
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, [dispatch, paymentFromStore, paymentId]);

  useEffect(() => {
    if (paymentFromStore) {
      setPayment(paymentFromStore);
    }
  }, [paymentFromStore]);

  if (loading || isLoadingGlobal) {
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

  if (!payment) {
    return null;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Chi tiết thanh toán</h4>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Semester:</strong> {payment.semester || '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Course:</strong> {payment.courseName || '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Amount:</strong>{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(Number(payment.amount) || 0)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date:</strong>{' '}
                  {payment.date ? new Date(payment.date).toLocaleDateString() : '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Notes:</strong> {payment.notes || 'N/A'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={() => navigate(`/payments/${payment.id}/edit`)}>
                Chỉnh sửa
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentDetailsPage;
