import React, { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from './ConfirmModal';
import * as api from '../services/api';
import { selectCurrentUser } from '../features/auth/authSlice';
import { toggleAdminStatus } from '../features/users/usersSlice';

const UserTable = ({ users, onUpdateUser }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showUnbanModal, setShowUnbanModal] = useState(false);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleBanAccount = (user) => {
        // Kiểm tra không cho phép ban chính mình
        if (currentUser && (currentUser.id === user.id || currentUser.username === user.username)) {
            alert('Bạn không thể khóa chính tài khoản của mình!');
            return;
        }
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const handleUnbanAccount = (user) => {
        setSelectedUser(user);
        setShowUnbanModal(true);
    };

    const handleToggleAdmin = (userId) => {
        dispatch(toggleAdminStatus(userId));
    };

    const confirmBanAccount = async () => {
        if (selectedUser) {
            // Kiểm tra không cho phép ban chính mình
            if (currentUser && (currentUser.id === selectedUser.id || currentUser.username === selectedUser.username)) {
                alert('Bạn không thể khóa chính tài khoản của mình!');
                setShowBanModal(false);
                setSelectedUser(null);
                return;
            }
            try {
                await api.banUser(selectedUser.id);
                onUpdateUser();
                setShowBanModal(false);
                setSelectedUser(null);
            } catch (error) {
                console.error('Error banning user:', error);
                alert('Không thể khóa tài khoản. Vui lòng thử lại.');
            }
        }
    };

    const confirmUnbanAccount = async () => {
        if (selectedUser) {
            try {
                await api.unbanUser(selectedUser.id);
                onUpdateUser();
                setShowUnbanModal(false);
                setSelectedUser(null);
            } catch (error) {
                console.error('Error unbanning user:', error);
                alert('Không thể mở khóa tài khoản. Vui lòng thử lại.');
            }
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            blocked: 'danger',
            locked: 'warning'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getRoleBadge = (role) => {
        return <Badge bg={role === 'admin' ? 'primary' : 'info'}>{role}</Badge>;
    };

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    <img 
                                        src={user.avatar || '/images/users/admin.jpg'} 
                                        alt={user.fullName || user.username}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.src = '/images/users/admin.jpg';
                                        }}
                                    />
                                </td>
                                <td>{user.username}</td>
                                <td>{user.fullName}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{getStatusBadge(user.status)}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleViewDetails(user)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleToggleAdmin(user.id)}
                                    >
                                        Toggle Admin
                                    </Button>
                                    {user.status === 'active' ? (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleBanAccount(user)}
                                            disabled={currentUser && (currentUser.id === user.id || currentUser.username === user.username)}
                                            title={currentUser && (currentUser.id === user.id || currentUser.username === user.username) ? 'Bạn không thể khóa chính mình' : ''}
                                        >
                                            Ban Account
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleUnbanAccount(user)}
                                        >
                                            Unban Account
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Modal xem chi tiết */}
            <ConfirmModal
                show={showViewModal}
                title="User Details"
                message={
                    selectedUser ? (
                        <div>
                            <div className="text-center mb-3">
                                <img 
                                    src={selectedUser.avatar || '/images/users/admin.jpg'} 
                                    alt={selectedUser.fullName || selectedUser.username}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/images/users/admin.jpg';
                                    }}
                                />
                            </div>
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                        </div>
                    ) : null
                }
                onConfirm={() => setShowViewModal(false)}
                onHide={() => setShowViewModal(false)}
                confirmText="Đóng"
                showCancel={false}
            />

            {/* Modal xác nhận ban */}
            <ConfirmModal
                show={showBanModal}
                title="Xác nhận khóa tài khoản"
                message={`Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser?.fullName} (${selectedUser?.username})?`}
                onConfirm={confirmBanAccount}
                onHide={() => setShowBanModal(false)}
                confirmText="Xác nhận"
                cancelText="Hủy"
            />

            {/* Modal xác nhận unban */}
            <ConfirmModal
                show={showUnbanModal}
                title="Xác nhận mở khóa tài khoản"
                message={`Bạn có chắc chắn muốn mở khóa tài khoản của ${selectedUser?.fullName} (${selectedUser?.username})?`}
                onConfirm={confirmUnbanAccount}
                onHide={() => setShowUnbanModal(false)}
                confirmText="Xác nhận"
                cancelText="Hủy"
            />
        </>
    );
};

export default UserTable;

