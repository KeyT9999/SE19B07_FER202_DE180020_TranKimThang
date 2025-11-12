/**
 * AdminChatPage Component
 * Chat page for admin
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ListGroup, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './AdminChatPage.css';

function AdminChatPage() {
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
    <div className="admin-chat-page">
      <Container>
        <div className="page-header-admin mb-4">
          <h1 className="page-title-admin"><i className="fas fa-comments me-2"></i>Tin nhắn</h1>
        </div>

        <Row>
          <Col md={4}>
            <Card className="chat-list-card-admin">
              <Card.Header className="card-header-admin">
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
                      <ListGroup.Item key={chat.id} action onClick={() => navigate(`/admin/chat/${chat.id}`)} className="chat-item-admin">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{chat.userName}</h6>
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
            <Card className="chat-room-card-admin">
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

export default AdminChatPage;

