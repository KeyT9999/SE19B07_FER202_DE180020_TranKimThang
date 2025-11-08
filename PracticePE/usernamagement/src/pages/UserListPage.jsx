/**
 * UserListPage.jsx - Trang quản lý danh sách users
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Hiển thị danh sách users từ database
 * 2. Lọc users theo: search term, role, status
 * 3. Sắp xếp users theo: id, username, fullName
 * 4. Quản lý users: ban/unban account
 * 
 * LUỒNG XỬ LÝ:
 * 1. Component mount → Gọi loadUsers() để lấy danh sách users
 * 2. User nhập filter → UserFilter gọi onFilterChange → Cập nhật filters state
 * 3. filters thay đổi → useMemo tính toán lại filteredUsers
 * 4. filteredUsers thay đổi → UserTable re-render với danh sách mới
 * 5. User ban/unban → Gọi API → Gọi handleUpdateUser() → Reload users
 * 
 * TỐI ƯU PERFORMANCE:
 * - useCallback: Memoize functions để tránh re-render không cần thiết
 * - useMemo: Chỉ tính toán filteredUsers khi users hoặc filters thay đổi
 */

// Import React hooks để quản lý state và side effects
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Import Bootstrap components để tạo UI
import { Container, Card } from 'react-bootstrap';

// Import các components con
import NavigationHeader from '../components/NavigationHeader';  // Header với thông tin user và nút logout
import UserFilter from '../components/UserFilter';  // Component lọc users (search, role, status, sort)
import UserTable from '../components/UserTable';  // Component hiển thị bảng users

// Import API service để gọi API
import * as api from '../services/api';

/**
 * UserListPage - Component chính của trang quản lý users
 * 
 * STATE:
 * - users: Danh sách users từ API (chưa lọc)
 * - filters: Object chứa các bộ lọc (searchTerm, roleFilter, statusFilter, sortBy)
 * - filteredUsers: Danh sách users đã được lọc và sắp xếp (tính toán từ useMemo)
 */
const UserListPage = () => {
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================

    /**
     * users - Danh sách users từ API (chưa lọc)
     * 
     * Mặc định: [] (mảng rỗng)
     * Được cập nhật: Khi gọi loadUsers() thành công
     */
    const [users, setUsers] = useState([]);

    /**
     * filters - Object chứa các bộ lọc
     * 
     * Các trường:
     * - searchTerm: Chuỗi tìm kiếm (tìm trong username và fullName)
     * - roleFilter: Lọc theo role ('all', 'admin', 'user')
     * - statusFilter: Lọc theo status ('all', 'active', 'blocked', 'locked')
     * - sortBy: Sắp xếp theo ('id', 'username', 'fullName')
     * 
     * Được cập nhật: Khi UserFilter gọi onFilterChange
     */
    const [filters, setFilters] = useState({
        searchTerm: '',  // Chuỗi tìm kiếm
        roleFilter: 'all',  // Lọc theo role: 'all' = tất cả, 'admin' = chỉ admin, 'user' = chỉ user
        statusFilter: 'all',  // Lọc theo status: 'all' = tất cả, 'active' = chỉ active, 'blocked' = chỉ blocked
        sortBy: 'id'  // Sắp xếp theo: 'id', 'username', 'fullName'
    });

    // ==========================================
    // FUNCTIONS
    // ==========================================

    /**
     * loadUsers() - Hàm load danh sách users từ API
     * 
     * LUỒNG XỬ LÝ:
     * 1. Gọi API getUsers() để lấy danh sách users
     * 2. Nếu thành công: Cập nhật state users
     * 3. Nếu thất bại: Log lỗi ra console
     * 
     * Sử dụng useCallback để memoize function
     * (tránh tạo function mới mỗi lần render → tối ưu performance)
     */
    const loadUsers = useCallback(async () => {
        try {
            // Gọi API để lấy danh sách users từ server (db.json)
            const data = await api.getUsers();
            
            // Cập nhật state users với dữ liệu từ API
            setUsers(data);
        } catch (error) {
            // Nếu có lỗi, log ra console (có thể hiển thị thông báo lỗi cho user)
            console.error('Error loading users:', error);
        }
    }, []); // Empty dependency array = function không thay đổi

    /**
     * useEffect - Gọi loadUsers() khi component mount
     * 
     * LUỒNG XỬ LÝ:
     * 1. Component mount (lần đầu render)
     * 2. Gọi loadUsers() để lấy danh sách users từ API
     * 3. Cập nhật state users
     * 
     * Dependency: [loadUsers]
     * - Chỉ chạy lại khi loadUsers thay đổi
     * - Nhưng loadUsers đã được memoize bằng useCallback nên không thay đổi
     * - => Chỉ chạy 1 lần khi component mount
     */
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // ==========================================
    // COMPUTED VALUES - TÍNH TOÁN FILTERED USERS
    // ==========================================

    /**
     * filteredUsers - Danh sách users đã được lọc và sắp xếp
     * 
     * LUỒNG XỬ LÝ:
     * 1. Bắt đầu với danh sách users gốc
     * 2. Lọc theo searchTerm (tìm trong username và fullName)
     * 3. Lọc theo roleFilter (nếu không phải 'all')
     * 4. Lọc theo statusFilter (nếu không phải 'all')
     * 5. Sắp xếp theo sortBy (id, username, hoặc fullName)
     * 
     * Sử dụng useMemo để chỉ tính toán lại khi users hoặc filters thay đổi
     * (tối ưu performance - tránh tính toán lại không cần thiết)
     * 
     * Dependency: [users, filters]
     * - Chỉ tính toán lại khi users hoặc filters thay đổi
     */
    const filteredUsers = useMemo(() => {
        // Bước 1: Tạo bản sao của mảng users (tránh mutate mảng gốc)
        let filtered = [...users];

        // Bước 2: Lọc theo search term (nếu có)
        if (filters.searchTerm) {
            // Chuyển search term thành chữ thường để so sánh không phân biệt hoa thường
            const search = filters.searchTerm.toLowerCase();
            
            // Lọc users: Giữ lại những user có username hoặc fullName chứa search term
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(search) ||  // Tìm trong username
                    user.fullName.toLowerCase().includes(search)  // Tìm trong fullName
            );
        }

        // Bước 3: Lọc theo role (nếu không phải 'all')
        if (filters.roleFilter !== 'all') {
            // Lọc users: Chỉ giữ lại những user có role khớp với roleFilter
            filtered = filtered.filter((user) => user.role === filters.roleFilter);
        }

        // Bước 4: Lọc theo status (nếu không phải 'all')
        if (filters.statusFilter !== 'all') {
            // Lọc users: Chỉ giữ lại những user có status khớp với statusFilter
            filtered = filtered.filter((user) => user.status === filters.statusFilter);
        }

        // Bước 5: Sắp xếp theo sortBy
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'username':
                    // Sắp xếp theo username (so sánh chuỗi)
                    return a.username.localeCompare(b.username);
                    
                case 'fullName':
                    // Sắp xếp theo fullName (so sánh chuỗi)
                    return a.fullName.localeCompare(b.fullName);
                    
                case 'id':
                default:
                    // Sắp xếp theo id (so sánh số)
                    return parseInt(a.id) - parseInt(b.id);
            }
        });

        // Trả về danh sách users đã được lọc và sắp xếp
        return filtered;
    }, [users, filters]); // Chỉ tính toán lại khi users hoặc filters thay đổi

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    /**
     * handleFilterChange() - Xử lý khi filter thay đổi
     * 
     * LUỒNG XỬ LÝ:
     * 1. UserFilter gọi onFilterChange với filters mới
     * 2. Cập nhật state filters
     * 3. useMemo tự động tính toán lại filteredUsers
     * 
     * @param {Object} newFilters - Object chứa filters mới
     */
    const handleFilterChange = useCallback((newFilters) => {
        // Cập nhật state filters với giá trị mới
        // Khi filters thay đổi, useMemo sẽ tự động tính toán lại filteredUsers
        setFilters(newFilters);
    }, []); // Empty dependency array = function không thay đổi

    /**
     * handleUpdateUser() - Xử lý khi user được cập nhật (ban/unban)
     * 
     * LUỒNG XỬ LÝ:
     * 1. UserTable gọi onUpdateUser() sau khi ban/unban thành công
     * 2. Gọi loadUsers() để reload danh sách users từ API
     * 3. Cập nhật state users với dữ liệu mới
     * 4. useMemo tự động tính toán lại filteredUsers
     */
    const handleUpdateUser = useCallback(() => {
        // Reload danh sách users từ API
        // Sau khi reload, useMemo sẽ tự động tính toán lại filteredUsers
        loadUsers();
    }, [loadUsers]); // Dependency: loadUsers (đã được memoize)

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            {/* NavigationHeader: Header với thông tin user và nút logout */}
            <NavigationHeader />
            
            {/* Container: Wrapper chính của trang */}
            <Container className="pb-5">
                {/* Header của trang */}
                <div className="my-4">
                    <h2 className="h4 mb-1">User Management</h2>
                    <p className="text-muted mb-0">
                        Quản lý danh sách người dùng hệ thống.
                    </p>
                </div>
                
                {/* UserFilter: Component lọc users (search, role, status, sort)
                    - onFilterChange: Callback được gọi khi filter thay đổi */}
                <UserFilter onFilterChange={handleFilterChange} />
                
                {/* Card: Container cho bảng users */}
                <Card className="shadow-sm">
                    <Card.Body>
                        {/* UserTable: Component hiển thị bảng users
                            - users: Danh sách users đã được lọc và sắp xếp
                            - onUpdateUser: Callback được gọi khi user được cập nhật (ban/unban) */}
                        <UserTable users={filteredUsers} onUpdateUser={handleUpdateUser} />
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

// Export component để có thể import ở file khác
export default UserListPage;
