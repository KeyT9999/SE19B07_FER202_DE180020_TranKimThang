import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../components/NavigationHeader';
import FilterBar from '../components/FilterBar';
import PaymentTable from '../components/PaymentTable.jsx';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* 1. Header (Navigation Bar) */}
      <NavigationHeader />
      {/* 2. Main Dashboard Content */}
      <Container className="pb-5">
        <div className="d-flex justify-content-between align-items-center my-4">
          <div>
            <h2 className="h4 mb-1">Dashboard Overview</h2>
            <p className="text-muted mb-0">
              Theo dõi và quản lý các khoản thanh toán học phí của bạn.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/payments/new')}>
            + Add Payment
          </Button>
        </div>
        <FilterBar />
        <Card className="shadow-sm">
          <Card.Body>
            <PaymentTable />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default DashboardPage;
