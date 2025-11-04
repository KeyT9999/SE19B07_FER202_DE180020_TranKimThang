// MovieManager: Trang quản lý chính, bọc nội dung bởi MovieProvider
// - MovieProvider cung cấp state/hành động cho toàn bộ cây con
// - MovieManagerContent hiển thị UI: Form + Bảng
import React from 'react';
import { Container } from 'react-bootstrap';
import { MovieProvider } from '../contexts/MovieContext';
import MovieForm from '../components/MovieForm';
import MovieTable from '../components/MovieTable';

// Component con hiển thị nội dung, được bọc bởi Provider
const MovieManagerContent = () => {
    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">🎬 Quản lý Phim (Context + useReducer + Axios)</h1>
            
            <MovieForm /> 
            
            <h2 className="mt-4">Danh sách Phim</h2>
            
            <MovieTable /> 
            
        </Container>
    );
}

// Component chính cung cấp Context (Provider bao ngoài content)
const MovieManager = () => (
    <MovieProvider>
        <MovieManagerContent />
    </MovieProvider>
);

export default MovieManager;

