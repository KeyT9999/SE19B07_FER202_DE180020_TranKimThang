/**
 * UserTable.jsx - Component hiển thị bảng danh sách users
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Hiển thị danh sách users trong bảng
 * 2. Xem chi tiết user (modal)
 * 3. Ban/Unban user account
 * 4. Hiển thị avatar, role, status với badge màu sắc
 * 
 * LUỒNG XỬ LÝ BAN/UNBAN:
 * 1. User click "Ban Account" → handleBanAccount() → Hiển thị modal xác nhận
 * 2. User xác nhận → confirmBanAccount() → Gọi API banUser()
 * 3. API thành công → Gọi onUpdateUser() → UserListPage reload users
 * 4. Tương tự với Unban
 * 
 * BẢO VỆ:
 * - Không cho phép ban chính mình (kiểm tra currentUser.id === user.id)
 * - Disable nút "Ban Account" nếu user đang cố ban chính mình
 */

// Import React hooks để quản lý state
import React, { useState } from 'react';

// Import Bootstrap components để tạo UI
import { Table, Button, Badge } from 'react-bootstrap';

// Import các components con
import ConfirmModal from './ConfirmModal';  // Modal xác nhận hành động

// Import API service để gọi API
import * as api from '../services/api';

// Import AuthContext để lấy thông tin user hiện tại
import { useAuth } from '../contexts/AuthContext';

/**
 * UserTable - Component hiển thị bảng users
 * 
 * PROPS:
 * - users: Mảng chứa danh sách users cần hiển thị (đã được lọc và sắp xếp)
 * - onUpdateUser: Function được gọi sau khi user được cập nhật (ban/unban)
 *   - Được gọi từ: UserListPage.handleUpdateUser()
 *   - Mục đích: Reload danh sách users từ API
 * 
 * STATE:
 * - selectedUser: User được chọn để xem chi tiết hoặc ban/unban
 * - showViewModal: Hiển thị modal xem chi tiết user
 * - showBanModal: Hiển thị modal xác nhận ban user
 * - showUnbanModal: Hiển thị modal xác nhận unban user
 */
const UserTable = ({ users, onUpdateUser }) => {
    // ==========================================
    // CONTEXT - LẤY THÔNG TIN USER HIỆN TẠI
    // ==========================================

    /**
     * currentUser - Thông tin user hiện tại đang đăng nhập
     * 
     * LÝ DO: Kiểm tra không cho phép ban chính mình
     * Được lấy từ: AuthContext (thông qua useAuth hook)
     */
    const { user: currentUser } = useAuth();

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================

    /**
     * selectedUser - User được chọn để xem chi tiết hoặc ban/unban
     * Mặc định: null
     * Được set: Khi user click "View Details", "Ban Account", hoặc "Unban Account"
     */
    const [selectedUser, setSelectedUser] = useState(null);

    /**
     * showViewModal - Hiển thị modal xem chi tiết user
     * Mặc định: false (ẩn modal)
     * Được set: true khi user click "View Details"
     */
    const [showViewModal, setShowViewModal] = useState(false);

    /**
     * showBanModal - Hiển thị modal xác nhận ban user
     * Mặc định: false (ẩn modal)
     * Được set: true khi user click "Ban Account"
     */
    const [showBanModal, setShowBanModal] = useState(false);

    /**
     * showUnbanModal - Hiển thị modal xác nhận unban user
     * Mặc định: false (ẩn modal)
     * Được set: true khi user click "Unban Account"
     */
    const [showUnbanModal, setShowUnbanModal] = useState(false);

    // ==========================================
    // EVENT HANDLERS - XỬ LÝ CLICK BUTTONS
    // ==========================================

    /**
     * handleViewDetails() - Xử lý khi user click "View Details"
     * 
     * LUỒNG XỬ LÝ:
     * 1. User click "View Details" → Gọi handleViewDetails(user)
     * 2. Set selectedUser = user được chọn
     * 3. Hiển thị modal (setShowViewModal = true)
     * 
     * @param {Object} user - User object cần xem chi tiết
     */
    const handleViewDetails = (user) => {
        // Lưu user được chọn vào state
        setSelectedUser(user);
        // Hiển thị modal xem chi tiết
        setShowViewModal(true);
    };

    /**
     * handleBanAccount() - Xử lý khi user click "Ban Account"
     * 
     * LUỒNG XỬ LÝ:
     * 1. User click "Ban Account" → Gọi handleBanAccount(user)
     * 2. Kiểm tra không cho phép ban chính mình
     * 3. Nếu hợp lệ: Set selectedUser và hiển thị modal xác nhận
     * 
     * BẢO VỆ:
     * - Không cho phép ban chính mình
     * - Hiển thị alert nếu user cố ban chính mình
     * 
     * @param {Object} user - User object cần ban
     */
    const handleBanAccount = (user) => {
        // Kiểm tra không cho phép ban chính mình
        // So sánh ID hoặc username để đảm bảo chính xác
        if (currentUser && (currentUser.id === user.id || currentUser.username === user.username)) {
            // Hiển thị thông báo lỗi
            alert('Bạn không thể khóa chính tài khoản của mình!');
            return; // Thoát khỏi function, không làm gì thêm
        }
        
        // Lưu user được chọn vào state
        setSelectedUser(user);
        // Hiển thị modal xác nhận ban
        setShowBanModal(true);
    };

    /**
     * handleUnbanAccount() - Xử lý khi user click "Unban Account"
     * 
     * LUỒNG XỬ LÝ:
     * 1. User click "Unban Account" → Gọi handleUnbanAccount(user)
     * 2. Set selectedUser và hiển thị modal xác nhận
     * 
     * @param {Object} user - User object cần unban
     */
    const handleUnbanAccount = (user) => {
        // Lưu user được chọn vào state
        setSelectedUser(user);
        // Hiển thị modal xác nhận unban
        setShowUnbanModal(true);
    };

    /**
     * confirmBanAccount() - Xác nhận ban user
     * 
     * LUỒNG XỬ LÝ:
     * 1. User xác nhận ban trong modal → Gọi confirmBanAccount()
     * 2. Kiểm tra lại không cho phép ban chính mình (bảo vệ kép)
     * 3. Gọi API banUser() để ban user
     * 4. Nếu thành công: Gọi onUpdateUser() để reload users, đóng modal
     * 5. Nếu thất bại: Hiển thị thông báo lỗi
     */
    const confirmBanAccount = async () => {
        // Kiểm tra có selectedUser không
        if (selectedUser) {
            // Kiểm tra lại không cho phép ban chính mình (bảo vệ kép)
            if (currentUser && (currentUser.id === selectedUser.id || currentUser.username === selectedUser.username)) {
                // Hiển thị thông báo lỗi
                alert('Bạn không thể khóa chính tài khoản của mình!');
                // Đóng modal và reset selectedUser
                setShowBanModal(false);
                setSelectedUser(null);
                return; // Thoát khỏi function
            }
            
            try {
                // Gọi API để ban user (set status = 'blocked')
                await api.banUser(selectedUser.id);
                
                // Sau khi ban thành công, reload danh sách users
                // onUpdateUser() sẽ gọi UserListPage.loadUsers() để lấy danh sách mới
                onUpdateUser();
                
                // Đóng modal và reset selectedUser
                setShowBanModal(false);
                setSelectedUser(null);
            } catch (error) {
                // Nếu có lỗi, log ra console và hiển thị thông báo lỗi
                console.error('Error banning user:', error);
                alert('Không thể khóa tài khoản. Vui lòng thử lại.');
            }
        }
    };

    /**
     * confirmUnbanAccount() - Xác nhận unban user
     * 
     * LUỒNG XỬ LÝ:
     * 1. User xác nhận unban trong modal → Gọi confirmUnbanAccount()
     * 2. Gọi API unbanUser() để unban user
     * 3. Nếu thành công: Gọi onUpdateUser() để reload users, đóng modal
     * 4. Nếu thất bại: Hiển thị thông báo lỗi
     */
    const confirmUnbanAccount = async () => {
        // Kiểm tra có selectedUser không
        if (selectedUser) {
            try {
                // Gọi API để unban user (set status = 'active')
                await api.unbanUser(selectedUser.id);
                
                // Sau khi unban thành công, reload danh sách users
                onUpdateUser();
                
                // Đóng modal và reset selectedUser
                setShowUnbanModal(false);
                setSelectedUser(null);
            } catch (error) {
                // Nếu có lỗi, log ra console và hiển thị thông báo lỗi
                console.error('Error unbanning user:', error);
                alert('Không thể mở khóa tài khoản. Vui lòng thử lại.');
            }
        }
    };

    // ==========================================
    // HELPER FUNCTIONS - HIỂN THỊ BADGE
    // ==========================================

    /**
     * getStatusBadge() - Tạo badge hiển thị status với màu sắc
     * 
     * MÀU SẮC:
     * - active: 'success' (xanh lá)
     * - blocked: 'danger' (đỏ)
     * - locked: 'warning' (vàng)
     * - Khác: 'secondary' (xám)
     * 
     * @param {string} status - Status của user ('active', 'blocked', 'locked')
     * @returns {JSX.Element} Badge component với màu sắc tương ứng
     */
    const getStatusBadge = (status) => {
        // Object map status với màu sắc tương ứng
        const variants = {
            active: 'success',  // Xanh lá
            blocked: 'danger',  // Đỏ
            locked: 'warning'  // Vàng
        };
        
        // Trả về Badge với màu sắc tương ứng, mặc định là 'secondary' nếu không tìm thấy
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    /**
     * getRoleBadge() - Tạo badge hiển thị role với màu sắc
     * 
     * MÀU SẮC:
     * - admin: 'primary' (xanh dương)
     * - user: 'info' (xanh nhạt)
     * 
     * @param {string} role - Role của user ('admin', 'user')
     * @returns {JSX.Element} Badge component với màu sắc tương ứng
     */
    const getRoleBadge = (role) => {
        // Trả về Badge với màu sắc: admin = primary (xanh dương), user = info (xanh nhạt)
        return <Badge bg={role === 'admin' ? 'primary' : 'info'}>{role}</Badge>;
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            {/* Bảng hiển thị danh sách users */}
            <Table striped bordered hover responsive>
                {/* Header của bảng */}
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
                
                {/* Body của bảng */}
                <tbody>
                    {/* Nếu không có users, hiển thị thông báo */}
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        // Nếu có users, map qua từng user và hiển thị
                        users.map((user) => (
                            <tr key={user.id}>
                                {/* Cột ID */}
                                <td>{user.id}</td>
                                
                                {/* Cột Avatar */}
                                <td>
                                    <img 
                                        src={user.avatar || '/images/users/admin.jpg'}  // Avatar của user, mặc định là admin.jpg
                                        alt={user.fullName || user.username}  // Alt text
                                        style={{
                                            width: '40px',  // Chiều rộng
                                            height: '40px',  // Chiều cao
                                            borderRadius: '50%',  // Bo tròn (hình tròn)
                                            objectFit: 'cover'  // Cắt ảnh để vừa khung
                                        }}
                                        onError={(e) => {
                                            // Nếu ảnh lỗi, hiển thị ảnh mặc định
                                            e.target.src = '/images/users/admin.jpg';
                                        }}
                                    />
                                </td>
                                
                                {/* Cột Username */}
                                <td>{user.username}</td>
                                
                                {/* Cột Full Name */}
                                <td>{user.fullName}</td>
                                
                                {/* Cột Role - Hiển thị với badge màu sắc */}
                                <td>{getRoleBadge(user.role)}</td>
                                
                                {/* Cột Status - Hiển thị với badge màu sắc */}
                                <td>{getStatusBadge(user.status)}</td>
                                
                                {/* Cột Action - Các nút thao tác */}
                                <td>
                                    {/* Nút "View Details" - Luôn hiển thị */}
                                    <Button
                                        variant="info"  // Màu xanh nhạt
                                        size="sm"  // Kích thước nhỏ
                                        className="me-2"  // Margin right
                                        onClick={() => handleViewDetails(user)}  // Xử lý khi click
                                    >
                                        View Details
                                    </Button>
                                    
                                    {/* Nút "Ban Account" hoặc "Unban Account" - Tùy vào status */}
                                    {user.status === 'active' ? (
                                        // Nếu user đang active, hiển thị nút "Ban Account"
                                        <Button
                                            variant="danger"  // Màu đỏ
                                            size="sm"  // Kích thước nhỏ
                                            onClick={() => handleBanAccount(user)}  // Xử lý khi click
                                            // Disable nếu user đang cố ban chính mình
                                            disabled={currentUser && (currentUser.id === user.id || currentUser.username === user.username)}
                                            // Tooltip hiển thị khi hover (nếu disabled)
                                            title={currentUser && (currentUser.id === user.id || currentUser.username === user.username) ? 'Bạn không thể khóa chính mình' : ''}
                                        >
                                            Ban Account
                                        </Button>
                                    ) : (
                                        // Nếu user đang blocked, hiển thị nút "Unban Account"
                                        <Button
                                            variant="success"  // Màu xanh lá
                                            size="sm"  // Kích thước nhỏ
                                            onClick={() => handleUnbanAccount(user)}  // Xử lý khi click
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

            {/* Modal xem chi tiết user */}
            <ConfirmModal
                show={showViewModal}  // Hiển thị modal khi showViewModal = true
                title="User Details"  // Tiêu đề modal
                message={
                    // Nội dung modal: Hiển thị thông tin chi tiết của user
                    selectedUser ? (
                        <div>
                            {/* Avatar của user */}
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
                            {/* Thông tin chi tiết */}
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                        </div>
                    ) : null
                }
                onConfirm={() => setShowViewModal(false)}  // Đóng modal khi click "Đóng"
                onHide={() => setShowViewModal(false)}  // Đóng modal khi click ngoài hoặc nút X
                confirmText="Đóng"  // Text của nút xác nhận
                showCancel={false}  // Không hiển thị nút "Hủy"
            />

            {/* Modal xác nhận ban user */}
            <ConfirmModal
                show={showBanModal}  // Hiển thị modal khi showBanModal = true
                title="Xác nhận khóa tài khoản"  // Tiêu đề modal
                message={`Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser?.fullName} (${selectedUser?.username})?`}  // Nội dung xác nhận
                onConfirm={confirmBanAccount}  // Xác nhận ban user
                onHide={() => setShowBanModal(false)}  // Đóng modal khi click "Hủy" hoặc ngoài
                confirmText="Xác nhận"  // Text của nút xác nhận
                cancelText="Hủy"  // Text của nút hủy
            />

            {/* Modal xác nhận unban user */}
            <ConfirmModal
                show={showUnbanModal}  // Hiển thị modal khi showUnbanModal = true
                title="Xác nhận mở khóa tài khoản"  // Tiêu đề modal
                message={`Bạn có chắc chắn muốn mở khóa tài khoản của ${selectedUser?.fullName} (${selectedUser?.username})?`}  // Nội dung xác nhận
                onConfirm={confirmUnbanAccount}  // Xác nhận unban user
                onHide={() => setShowUnbanModal(false)}  // Đóng modal khi click "Hủy" hoặc ngoài
                confirmText="Xác nhận"  // Text của nút xác nhận
                cancelText="Hủy"  // Text của nút hủy
            />
        </>
    );
};

// Export component để có thể import ở file khác
export default UserTable;
