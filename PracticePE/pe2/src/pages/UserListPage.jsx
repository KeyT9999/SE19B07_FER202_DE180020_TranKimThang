import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import NavigationHeader from '../components/NavigationHeader';
import UserFilter from '../components/UserFilter';
import UserTable from '../components/UserTable';
import * as api from '../services/api';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: '',
        roleFilter: 'all',
        statusFilter: 'all',
        sortBy: 'id'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, filters]);

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...users];

        // Lọc theo search term
        if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(search) ||
                    user.fullName.toLowerCase().includes(search)
            );
        }

        // Lọc theo role
        if (filters.roleFilter !== 'all') {
            filtered = filtered.filter((user) => user.role === filters.roleFilter);
        }

        // Lọc theo status
        if (filters.statusFilter !== 'all') {
            filtered = filtered.filter((user) => user.status === filters.statusFilter);
        }

        // Sắp xếp
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'username':
                    return a.username.localeCompare(b.username);
                case 'fullName':
                    return a.fullName.localeCompare(b.fullName);
                case 'id':
                default:
                    return parseInt(a.id) - parseInt(b.id);
            }
        });

        setFilteredUsers(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleUpdateUser = () => {
        loadUsers();
    };

    return (
        <>
            <NavigationHeader />
            <Container className="pb-5">
                <div className="my-4">
                    <h2 className="h4 mb-1">User Management</h2>
                    <p className="text-muted mb-0">
                        Quản lý danh sách người dùng hệ thống.
                    </p>
                </div>
                <UserFilter onFilterChange={handleFilterChange} />
                <Card className="shadow-sm">
                    <Card.Body>
                        <UserTable users={filteredUsers} onUpdateUser={handleUpdateUser} />
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default UserListPage;

