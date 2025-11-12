/**
 * RestaurantOwnerChatPage Component
 * Chat list for restaurant owners
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ListGroup, Badge, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerChatPage.css';

function RestaurantOwnerChatPage() {
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load chats
      setChats([]);
    } catch (error) {
      console.error('Error loading chats:', error);
      setErrorWithTimeout('Không thể tải danh sách chat.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải danh sách chat..." />;

  return (
    <div className="restaurant-owner-chat-page">
      <Container>
        <div className="page-header-owner mb-4">
          <h1 className="page-title-owner"><i className="fas fa-comments me-2"></i>Tin nhắn</h1>
        </div>

        <Row>
          <Col md={4}>
            <Card className="chat-list-card-owner">
              <Card.Header className="card-header-owner">
                <Form.Control type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </Card.Header>
              <Card.Body className="p-0">
                {chats.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {chats.map((chat) => (
                      <ListGroup.Item key={chat.id} action onClick={() => navigate(`/restaurant-owner/chat/${chat.id}`)} className="chat-item-owner">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{chat.customerName}</h6>
                            <p className="mb-0 text-muted small">{chat.lastMessage}</p>
                          </div>
                          <Badge bg="primary">{chat.unreadCount || 0}</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="chat-room-card-owner">
              <Card.Body className="text-center py-5">
                <i className="fas fa-comment-dots fa-3x text-muted mb-3"></i>
                <p className="text-muted">Chọn một cuộc trò chuyện để bắt đầu</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantOwnerChatPage;

