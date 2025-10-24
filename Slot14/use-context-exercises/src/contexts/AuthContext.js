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
    login: () => ({ ok: false, message: "" }), //hàm đăng nhập
    logout: () => {}, //hàm đăng xuất
    clearError: () => {}, //hàm xóa lỗi
    error: null, //thông báo lỗi
    loading: false //trạng thái gọi API
});

//2. Tạo provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
    // State quản lý thông tin user và trạng thái đăng nhập
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const clearError = React.useCallback(() => {
        setError(null);
    }, []);

    // Hàm đăng nhập
    const login = (identifier, password) => {
        clearError(); // Reset error
        setLoading(true);

        const finish = (payload) => {
            setLoading(false);
            return payload;
        };

        const trimmedIdentifier = identifier?.trim() || "";
        const trimmedPassword = password?.trim() || "";
        
        // Tìm user trong mock data
        const foundUser = mockAccounts.find(account => 
            (account.username === trimmedIdentifier || account.email === trimmedIdentifier) && 
            account.password === trimmedPassword
        );

        if (!foundUser) {
            const message = "Tên đăng nhập hoặc mật khẩu không đúng!";
            setError(message);
            return finish({ ok: false, message });
        }

        if (foundUser.status !== 'active') {
            const message = "Tài khoản đã bị khóa!";
            setError(message);
            return finish({ ok: false, message });
        }

        // Chỉ cho phép admin đăng nhập
        if (foundUser.role !== 'admin') {
            const message = "Chỉ admin mới được phép đăng nhập!";
            setError(message);
            return finish({ ok: false, message });
        }

        // Đăng nhập thành công
        setUser(foundUser);
        setIsAuthenticated(true);
        return finish({
            ok: true,
            user: foundUser,
            message: `Chào mừng ${foundUser.username}!`
        });
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        setLoading(false);
    };

    //Tạo object context chứa giá trị và các hàm
    const contextValue = {
        user, //thông tin user hiện tại
        isAuthenticated, //trạng thái đăng nhập
        login, //hàm đăng nhập
        logout, //hàm đăng xuất
        clearError, //hàm xóa lỗi
        error, //thông báo lỗi
        loading //trạng thái gọi API
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
