/**
 * UserFilter.jsx - Component lọc và tìm kiếm users
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Tìm kiếm users theo username hoặc fullName
 * 2. Lọc users theo role (admin, user, all)
 * 3. Lọc users theo status (active, blocked, locked, all)
 * 4. Sắp xếp users theo id, username, hoặc fullName
 * 
 * LUỒNG XỬ LÝ:
 * 1. User nhập/chọn filter → Cập nhật state tương ứng (searchTerm, roleFilter, statusFilter, sortBy)
 * 2. State thay đổi → useEffect detect → So sánh với giá trị trước đó
 * 3. Nếu có thay đổi → Gọi onFilterChange() với filters mới
 * 4. UserListPage nhận filters mới → Cập nhật filters state → useMemo tính toán lại filteredUsers
 * 
 * TỐI ƯU PERFORMANCE:
 * - Bỏ qua lần render đầu tiên (vì UserListPage đã có giá trị mặc định)
 * - Chỉ gọi onFilterChange khi filters thực sự thay đổi (so sánh với giá trị trước đó)
 * - Sử dụng useRef để lưu giá trị trước đó (không gây re-render)
 */

// Import React hooks để quản lý state và side effects
import React, { useState, useEffect, useRef } from 'react';

// Import Bootstrap components để tạo UI
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

/**
 * UserFilter - Component lọc users
 * 
 * PROPS:
 * - onFilterChange: Function được gọi khi filter thay đổi
 *   - Nhận vào: Object { searchTerm, roleFilter, statusFilter, sortBy }
 *   - Được gọi từ: UserListPage.handleFilterChange()
 * 
 * STATE:
 * - searchTerm: Chuỗi tìm kiếm
 * - roleFilter: Lọc theo role ('all', 'admin', 'user')
 * - statusFilter: Lọc theo status ('all', 'active', 'blocked', 'locked')
 * - sortBy: Sắp xếp theo ('id', 'username', 'fullName')
 */
const UserFilter = ({ onFilterChange }) => {
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================

    /**
     * searchTerm - Chuỗi tìm kiếm (tìm trong username và fullName)
     * Mặc định: '' (chuỗi rỗng)
     */
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * roleFilter - Lọc theo role
     * Mặc định: 'all' (tất cả roles)
     * Giá trị: 'all', 'admin', 'user'
     */
    const [roleFilter, setRoleFilter] = useState('all');

    /**
     * statusFilter - Lọc theo status
     * Mặc định: 'all' (tất cả status)
     * Giá trị: 'all', 'active', 'blocked', 'locked'
     */
    const [statusFilter, setStatusFilter] = useState('all');

    /**
     * sortBy - Sắp xếp theo
     * Mặc định: 'id' (sắp xếp theo ID)
     * Giá trị: 'id', 'username', 'fullName'
     */
    const [sortBy, setSortBy] = useState('id');

    // ==========================================
    // REFS - LƯU GIÁ TRỊ KHÔNG GÂY RE-RENDER
    // ==========================================

    /**
     * isFirstRender - Flag để đánh dấu lần render đầu tiên
     * 
     * LÝ DO: Bỏ qua lần render đầu tiên vì UserListPage đã có giá trị mặc định
     * (tránh gọi onFilterChange không cần thiết)
     */
    const isFirstRender = useRef(true);

    /**
     * prevFiltersRef - Lưu giá trị filters trước đó
     * 
     * LÝ DO: So sánh với giá trị hiện tại để chỉ gọi onFilterChange khi thực sự thay đổi
     * (tối ưu performance - tránh gọi callback không cần thiết)
     */
    const prevFiltersRef = useRef({ searchTerm, roleFilter, statusFilter, sortBy });

    // ==========================================
    // SIDE EFFECTS - XỬ LÝ KHI FILTER THAY ĐỔI
    // ==========================================

    /**
     * useEffect - Gọi onFilterChange khi filters thay đổi
     * 
     * LUỒNG XỬ LÝ:
     * 1. Component render → Tạo object currentFilters từ state hiện tại
     * 2. Nếu là lần render đầu tiên:
     *    - Bỏ qua (không gọi onFilterChange)
     *    - Lưu currentFilters vào prevFiltersRef
     *    - Set isFirstRender = false
     * 3. Nếu không phải lần render đầu tiên:
     *    - So sánh currentFilters với prevFiltersRef.current
     *    - Nếu có thay đổi:
     *      - Lưu currentFilters vào prevFiltersRef
     *      - Gọi onFilterChange(currentFilters)
     * 
     * Dependency: [searchTerm, roleFilter, statusFilter, sortBy]
     * - Chạy lại khi bất kỳ filter nào thay đổi
     * - eslint-disable-next-line: Bỏ qua warning về onFilterChange
     *   (vì onFilterChange đã được memoize ở parent component)
     */
    useEffect(() => {
        // Tạo object chứa tất cả filters hiện tại
        const currentFilters = { searchTerm, roleFilter, statusFilter, sortBy };
        
        // Bước 1: Bỏ qua lần render đầu tiên
        // LÝ DO: UserListPage đã có giá trị mặc định, không cần gọi onFilterChange
        if (isFirstRender.current) {
            // Đánh dấu đã render lần đầu
            isFirstRender.current = false;
            // Lưu giá trị hiện tại vào prevFiltersRef để so sánh lần sau
            prevFiltersRef.current = currentFilters;
            return; // Thoát khỏi useEffect, không gọi onFilterChange
        }
        
        // Bước 2: So sánh với giá trị trước đó
        // Chỉ gọi onFilterChange nếu filters thực sự thay đổi
        const hasChanged = 
            prevFiltersRef.current.searchTerm !== currentFilters.searchTerm ||  // searchTerm thay đổi
            prevFiltersRef.current.roleFilter !== currentFilters.roleFilter ||  // roleFilter thay đổi
            prevFiltersRef.current.statusFilter !== currentFilters.statusFilter ||  // statusFilter thay đổi
            prevFiltersRef.current.sortBy !== currentFilters.sortBy;  // sortBy thay đổi
        
        // Bước 3: Nếu có thay đổi, gọi onFilterChange
        if (hasChanged) {
            // Lưu giá trị mới vào prevFiltersRef để so sánh lần sau
            prevFiltersRef.current = currentFilters;
            // Gọi callback để thông báo cho parent component (UserListPage)
            onFilterChange(currentFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, roleFilter, statusFilter, sortBy]);
    // NOTE: Bỏ qua warning về onFilterChange vì nó đã được memoize ở parent component

    // ==========================================
    // EVENT HANDLERS - XỬ LÝ THAY ĐỔI INPUT
    // ==========================================

    /**
     * handleSearchChange() - Xử lý khi user nhập vào ô tìm kiếm
     * 
     * LUỒNG XỬ LÝ:
     * 1. User nhập text → onChange event được trigger
     * 2. Lấy giá trị từ event.target.value
     * 3. Cập nhật state searchTerm
     * 4. useEffect detect searchTerm thay đổi → Gọi onFilterChange
     * 
     * @param {Event} e - Event object từ input
     */
    const handleSearchChange = (e) => {
        // Cập nhật state searchTerm với giá trị mới
        // Khi searchTerm thay đổi, useEffect sẽ tự động gọi onFilterChange
        setSearchTerm(e.target.value);
    };

    /**
     * handleRoleChange() - Xử lý khi user chọn role filter
     * 
     * @param {Event} e - Event object từ select
     */
    const handleRoleChange = (e) => {
        // Cập nhật state roleFilter với giá trị mới
        setRoleFilter(e.target.value);
    };

    /**
     * handleStatusChange() - Xử lý khi user chọn status filter
     * 
     * @param {Event} e - Event object từ select
     */
    const handleStatusChange = (e) => {
        // Cập nhật state statusFilter với giá trị mới
        setStatusFilter(e.target.value);
    };

    /**
     * handleSortChange() - Xử lý khi user chọn sort option
     * 
     * @param {Event} e - Event object từ select
     */
    const handleSortChange = (e) => {
        // Cập nhật state sortBy với giá trị mới
        setSortBy(e.target.value);
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <Row className="mb-3">
            {/* Ô tìm kiếm - Chiếm 4 cột (md={4}) */}
            <Col md={4}>
                <InputGroup>
                    {/* Icon tìm kiếm */}
                    <InputGroup.Text>🔍</InputGroup.Text>
                    
                    {/* Input tìm kiếm */}
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo username, fullName..."
                        value={searchTerm}  // Controlled component: Giá trị từ state
                        onChange={handleSearchChange}  // Xử lý khi user nhập
                    />
                </InputGroup>
            </Col>
            
            {/* Dropdown lọc theo role - Chiếm 2 cột (md={2}) */}
            <Col md={2}>
                <Form.Select 
                    value={roleFilter}  // Controlled component
                    onChange={handleRoleChange}  // Xử lý khi user chọn
                >
                    <option value="all">Tất cả Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </Form.Select>
            </Col>
            
            {/* Dropdown lọc theo status - Chiếm 2 cột (md={2}) */}
            <Col md={2}>
                <Form.Select 
                    value={statusFilter}  // Controlled component
                    onChange={handleStatusChange}  // Xử lý khi user chọn
                >
                    <option value="all">Tất cả Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="locked">Locked</option>
                </Form.Select>
            </Col>
            
            {/* Dropdown sắp xếp - Chiếm 2 cột (md={2}) */}
            <Col md={2}>
                <Form.Select 
                    value={sortBy}  // Controlled component
                    onChange={handleSortChange}  // Xử lý khi user chọn
                >
                    <option value="id">Sắp xếp theo ID</option>
                    <option value="username">Sắp xếp theo Username</option>
                    <option value="fullName">Sắp xếp theo FullName</option>
                </Form.Select>
            </Col>
        </Row>
    );
};

// Export component để có thể import ở file khác
export default UserFilter;
