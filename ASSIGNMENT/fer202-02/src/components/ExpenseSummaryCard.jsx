import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ExpenseSummaryCard = ({ total, label = 'Total of Expenses' }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="text-muted text-uppercase fs-6 mb-3">{label}</Card.Title>
        <div className="display-6 fw-semibold text-primary">{total}</div>
      </Card.Body>
    </Card>
  );
};

ExpenseSummaryCard.propTypes = {
  total: PropTypes.node.isRequired,
  label: PropTypes.string,
};

export default ExpenseSummaryCard;

