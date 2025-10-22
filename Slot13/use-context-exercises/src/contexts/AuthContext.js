//1. Khởi tạo auth context
import React, { createContext, useState } from "react";

// Dữ liệu mẫu thay thế cho API call
const mockAccounts = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        status: 'active'
    },
    {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: '123456',
        role: 'user',
        status: 'active'
    },
    {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        password: '123456',
        role: 'user',
        status: 'locked'
    }
];

//1. Khởi tạo context với giá trị mặc định
export const AuthContext = createContext({
    user: null, //thông tin user đã đăng nhập
    isAuthenticated: false, //trạng thái đăng nhập
    login: () => {}, //hàm đăng nhập
    logout: () => {}, //hàm đăng xuất
    error: null //thông báo lỗi
});

//2. Tạo provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
    // State quản lý thông tin user và trạng thái đăng nhập
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Hàm đăng nhập
    const login = (username, password) => {
        setError(null); // Reset error
        
        // Tìm user trong mock data
        const foundUser = mockAccounts.find(account => 
            account.username === username && 
            account.password === password
        );

        if (!foundUser) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng!");
            return false;
        }

        if (foundUser.status !== 'active') {
            setError("Tài khoản đã bị khóa!");
            return false;
        }

        // Chỉ cho phép admin đăng nhập
        if (foundUser.role !== 'admin') {
            setError("Chỉ admin mới được phép đăng nhập!");
            return false;
        }

        // Đăng nhập thành công
        setUser(foundUser);
        setIsAuthenticated(true);
        return true;
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    };

    //Tạo object context chứa giá trị và các hàm
    const contextValue = {
        user, //thông tin user hiện tại
        isAuthenticated, //trạng thái đăng nhập
        login, //hàm đăng nhập
        logout, //hàm đăng xuất
        error //thông báo lỗi
    };

    //3. Cung cấp giá trị context cho các component con
    return (
        <AuthContext.Provider value={contextValue}>
            {children} {/* Các component con sẽ có thể truy cập context này */}
        </AuthContext.Provider>
    );
};

//4.Custom hook để sử dụng context dễ dàng hơn
export const useAuth = () => {
    const context = React.useContext(AuthContext); //Lấy giá trị context hiện tại
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
