/**
 * RestaurantOwnerChatRoomPage Component
 * Chat room detail
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import './RestaurantOwnerChatRoomPage.css';

function RestaurantOwnerChatRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setErrorWithTimeout } = useApp();
  
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load chat and messages
      setChat(null);
      setMessages([]);
    } catch (error) {
      console.error('Error loading chat:', error);
      setErrorWithTimeout('Không thể tải tin nhắn.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      // TODO: Send message
      setMessage('');
    } catch (error) {
      setErrorWithTimeout('Không thể gửi tin nhắn.');
    }
  };

  if (loading) return <Loading message="Đang tải..." />;

  return (
    <div className="restaurant-owner-chat-room-page">
      <Container>
        <div className="page-header-owner mb-4">
          <Button variant="link" onClick={() => navigate('/restaurant-owner/chat')} className="back-button-owner">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
          <h1 className="page-title-owner"><i className="fas fa-comments me-2"></i>Tin nhắn</h1>
        </div>

        <Card className="chat-room-card-owner">
          <Card.Header className="card-header-owner">
            <h5 className="mb-0">{chat?.customerName || 'Khách hàng'}</h5>
          </Card.Header>
          <Card.Body className="chat-messages-owner">
            {messages.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message-owner ${msg.sender === 'owner' ? 'message-sent-owner' : 'message-received-owner'}`}>
                  <p className="mb-0">{msg.content}</p>
                  <small className="text-muted">{new Date(msg.timestamp).toLocaleTimeString('vi-VN')}</small>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </Card.Body>
          <Card.Footer>
            <Form onSubmit={handleSend}>
              <InputGroup>
                <Form.Control type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." />
                <Button variant="primary" type="submit"><i className="fas fa-paper-plane"></i></Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
}

export default RestaurantOwnerChatRoomPage;

