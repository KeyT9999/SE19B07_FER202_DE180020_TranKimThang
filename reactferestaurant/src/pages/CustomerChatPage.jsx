/**
 * CustomerChatPage Component
 * Page for customer chat support
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CustomerChatPage.css';

function CustomerChatPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.',
        sender: 'support',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="customer-chat-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <Card className="ds-card chat-container">
                <Card.Header className="chat-header">
                  <h4 className="mb-0">
                    <i className="fas fa-comments me-2"></i>
                    Hỗ trợ khách hàng
                  </h4>
                </Card.Header>
                <Card.Body className="chat-body p-0">
                  <div className="messages-container">
                    {messages.length === 0 ? (
                      <div className="empty-chat">
                        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message ${message.sender === 'user' ? 'message-user' : 'message-support'}`}
                        >
                          <div className="message-content">
                            <p className="message-text">{message.text}</p>
                            <span className="message-time">
                              {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-input-container">
                    <Form onSubmit={handleSendMessage}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tin nhắn..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="chat-input"
                        />
                        <Button type="submit" variant="primary">
                          <i className="fas fa-paper-plane"></i>
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default CustomerChatPage;

