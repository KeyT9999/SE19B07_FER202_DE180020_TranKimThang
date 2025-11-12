import React, { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavigationHeader from '../components/NavigationHeader';
import ExpenseSummaryCard from '../components/ExpenseSummaryCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import AppFooter from '../components/AppFooter.jsx';
import { useExpense } from '../contexts/ExpenseContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

const DashboardPage = () => {
  const { totalAmount } = useExpense();

  const formattedTotal = useMemo(() => formatCurrency(totalAmount), [totalAmount]);

  return (
    <>
      <NavigationHeader />
      <main className="dashboard py-4">
        <Container fluid="lg">
          <Row className="g-4 mb-3">
            <Col lg={4} md={6} sm={12}>
              <ExpenseSummaryCard total={formattedTotal} />
            </Col>
            <Col lg={8} md={6} sm={12}>
              <FilterBar />
            </Col>
          </Row>
          <Row className="g-4 align-items-stretch">
            <Col lg={4} md={12}>
              <ExpenseForm />
            </Col>
            <Col lg={8} md={12}>
              <ExpenseTable />
            </Col>
          </Row>
        </Container>
      </main>
      <AppFooter />
    </>
  );
};

export default DashboardPage;
