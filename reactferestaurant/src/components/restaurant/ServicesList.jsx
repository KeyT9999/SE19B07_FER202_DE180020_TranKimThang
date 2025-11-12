/**
 * ServicesList Component
 * Displays restaurant services
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { FaConciergeBell } from 'react-icons/fa';
import { getRestaurantServices } from '../../services/restaurantService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../common/Loading';
import './ServicesList.css';

function ServicesList({ restaurantId, selectedServices, onServiceToggle }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getRestaurantServices(restaurantId);
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [restaurantId]);

  const handleServiceToggle = (serviceId) => {
    if (!onServiceToggle) return;

    const isSelected = selectedServices?.some((s) => s.serviceId === serviceId);
    const service = services.find((s) => s.serviceId === serviceId);

    if (isSelected) {
      onServiceToggle(selectedServices.filter((s) => s.serviceId !== serviceId));
    } else {
      onServiceToggle([...selectedServices, service]);
    }
  };

  if (loading) {
    return <Loading message="Đang tải danh sách dịch vụ..." />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (services.length === 0) {
    return (
      <Alert variant="info">
        Nhà hàng này chưa có dịch vụ bổ sung.
      </Alert>
    );
  }

  return (
    <div className="services-list">
      <h3 className="section-title mb-4">
        <FaConciergeBell className="me-2" />
        Dịch vụ bổ sung
      </h3>
      <Row>
        {services.map((service) => {
          const isSelected = selectedServices?.some((s) => s.serviceId === service.serviceId);

          return (
            <Col key={service.serviceId} md={6} className="mb-3">
              <Card
                className={`service-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleServiceToggle(service.serviceId)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <div className="service-header">
                    <h5 className="service-name">{service.name}</h5>
                    {service.price && (
                      <span className="service-price">{formatCurrency(service.price)}</span>
                    )}
                  </div>
                  {service.description && (
                    <p className="service-description">{service.description}</p>
                  )}
                  {service.category && (
                    <span className="service-category badge bg-secondary">
                      {service.category}
                    </span>
                  )}
                  {isSelected && (
                    <div className="service-selected-indicator">
                      <span className="badge bg-success">Đã chọn</span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default ServicesList;

