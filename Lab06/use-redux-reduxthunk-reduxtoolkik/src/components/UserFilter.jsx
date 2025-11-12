import React, { useState } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

const UserFilter = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('id');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilterChange({ searchTerm: value, roleFilter, statusFilter, sortBy });
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRoleFilter(value);
        onFilterChange({ searchTerm, roleFilter: value, statusFilter, sortBy });
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        onFilterChange({ searchTerm, roleFilter, statusFilter: value, sortBy });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        onFilterChange({ searchTerm, roleFilter, statusFilter, sortBy: value });
    };

    return (
        <Row className="mb-3">
            <Col md={4}>
                <InputGroup>
                    <InputGroup.Text>🔍</InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo username, fullName..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </InputGroup>
            </Col>
            <Col md={2}>
                <Form.Select value={roleFilter} onChange={handleRoleChange}>
                    <option value="all">Tất cả Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Select value={statusFilter} onChange={handleStatusChange}>
                    <option value="all">Tất cả Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="locked">Locked</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Select value={sortBy} onChange={handleSortChange}>
                    <option value="id">Sắp xếp theo ID</option>
                    <option value="username">Sắp xếp theo Username</option>
                    <option value="fullName">Sắp xếp theo FullName</option>
                </Form.Select>
            </Col>
        </Row>
    );
};

export default UserFilter;

