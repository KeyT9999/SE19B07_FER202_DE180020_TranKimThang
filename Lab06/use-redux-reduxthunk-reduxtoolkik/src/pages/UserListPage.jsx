import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import NavigationHeader from '../components/NavigationHeader';
import UserFilter from '../components/UserFilter';
import UserTable from '../components/UserTable';
import {
    fetchUsers,
    makeSelectUsersByRoleAndStatus,
    selectUsersError,
    selectUsersLoading,
} from '../features/users/usersSlice';

const UserListPage = () => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        roleFilter: 'all',
        statusFilter: 'all',
        sortBy: 'id'
    });

    const dispatch = useDispatch();
    const selectFilteredUsers = useMemo(() => makeSelectUsersByRoleAndStatus(), []);
    const filteredUsers = useSelector((state) => selectFilteredUsers(state, filters));
    const isLoading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleUpdateUser = () => {
        dispatch(fetchUsers());
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
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}
                        {isLoading ? (
                            <div className="d-flex justify-content-center py-5">
                                <Spinner animation="border" role="status" />
                            </div>
                        ) : (
                            <UserTable users={filteredUsers} onUpdateUser={handleUpdateUser} />
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default UserListPage;

