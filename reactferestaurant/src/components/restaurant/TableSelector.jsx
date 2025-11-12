/**
 * TableSelector Component
 * Allows users to select tables for booking
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Badge } from 'react-bootstrap';
import { FaChair } from 'react-icons/fa';
import { getRestaurantTables } from '../../services/restaurantService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../common/Loading';
import './TableSelector.css';

function TableSelector({ restaurantId, selectedTables, onTableSelect, bookingDate, bookingTime }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getRestaurantTables(restaurantId);
        setTables(data || []);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Không thể tải danh sách bàn');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [restaurantId]);

  const handleTableToggle = (tableId) => {
    if (!onTableSelect) return;

    const isSelected = selectedTables.includes(tableId);
    if (isSelected) {
      onTableSelect(selectedTables.filter((id) => id !== tableId));
    } else {
      onTableSelect([...selectedTables, tableId]);
    }
  };

  if (loading) {
    return <Loading message="Đang tải danh sách bàn..." />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (tables.length === 0) {
    return (
      <Alert variant="info">
        Nhà hàng này chưa có thông tin về bàn. Vui lòng liên hệ nhà hàng để đặt bàn.
      </Alert>
    );
  }

  return (
    <div className="table-selector">
      <h3 className="section-title mb-4">
        <FaChair className="me-2" />
        Chọn bàn
      </h3>
      <Row>
        {tables.map((table) => {
          const isSelected = selectedTables.includes(table.tableId);
          const isAvailable = table.status === 'AVAILABLE';

          return (
            <Col key={table.tableId} md={4} sm={6} className="mb-3">
              <Card
                className={`table-card ${isSelected ? 'selected' : ''} ${
                  !isAvailable ? 'unavailable' : ''
                }`}
                onClick={() => isAvailable && handleTableToggle(table.tableId)}
                style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
              >
                <Card.Body>
                  <div className="table-header">
                    <h5 className="table-name">{table.tableName}</h5>
                    {isSelected && <Badge bg="success">Đã chọn</Badge>}
                    {!isAvailable && <Badge bg="secondary">Không khả dụng</Badge>}
                  </div>
                  <div className="table-info">
                    <p className="table-capacity">
                      <FaChair className="me-1" />
                      Sức chứa: {table.capacity} người
                    </p>
                    {table.depositAmount && (
                      <p className="table-deposit">
                        Đặt cọc: {formatCurrency(table.depositAmount)}
                      </p>
                    )}
                    {table.status && (
                      <p className="table-status">
                        Trạng thái: {table.status}
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      {selectedTables.length > 0 && (
        <Alert variant="success" className="mt-3">
          Đã chọn {selectedTables.length} bàn
        </Alert>
      )}
    </div>
  );
}

export default TableSelector;

