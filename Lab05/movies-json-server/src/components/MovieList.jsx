import React, { useState, useEffect } from 'react';

const API_ENDPOINT = 'http://localhost:3001/movies';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm bất đồng bộ (async/await) để gọi API
  const fetchMovies = async () => {
    try {
      const response = await fetch(API_ENDPOINT); // Mặc định là GET
      
      // Kiểm tra lỗi HTTP (ví dụ: 404, 500)
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      
      const data = await response.json(); // Chuyển đổi phản hồi sang JSON
      setMovies(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    } finally {
      setLoading(false); // Dù thành công hay thất bại cũng dừng loading
    }
  };

  // Gọi hàm fetchMovies() khi component được mount lần đầu
  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu phim...</div>;
  }

  return (
    <div>
      <h2>Danh sách Phim ({movies.length} phim)</h2>
      {movies.map(movie => (
        <div key={movie.id}>
          <strong>{movie.title}</strong> ({movie.year}) - Thể loại ID: {movie.genreId}
        </div>
      ))}
    </div>
  );
};

export default MovieList;