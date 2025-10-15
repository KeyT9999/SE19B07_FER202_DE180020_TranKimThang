import React, { useState } from 'react';

const data = [
  { id: 1, name: 'Thắng', category: 'Fruit' },
  { id: 2, name: 'Danh', category: 'Vegetable' },
  { id: 3, name: 'Phúc', category: 'Fruit' },
  { id: 4, name: 'Tài', category: 'Vegetable' },
];

function SearchItem() {
  const [searchTerm, setSearchTerm] = useState('');

  // Tính toán danh sách được lọc dựa trên searchTerm
  const filteredList = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        background: '#f7fafd',
      }}
    >
      <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>
        Tìm kiếm theo tên
      </h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm theo tên..."
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1.5px solid #90caf9',
          marginBottom: 18,
          fontSize: 16,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
        {filteredList.map(item => (
          <li
            key={item.id}
            style={{
              background: '#e3f2fd',
              marginBottom: 10,
              padding: '10px 14px',
              borderRadius: '7px',
              fontSize: 16,
              color: '#333',
              boxShadow: '0 1px 4px rgba(33,150,243,0.07)',
            }}
          >
            <span style={{ fontWeight: 600 }}>{item.name}</span> <span style={{ color: '#1976d2' }}>({item.category})</span>
          </li>
        ))}
        {filteredList.length === 0 && (
          <li style={{ color: '#888', textAlign: 'center', padding: '10px 0' }}>
            Không tìm thấy kết quả
          </li>
        )}
      </ul>
    </div>
  );
}
export default SearchItem;