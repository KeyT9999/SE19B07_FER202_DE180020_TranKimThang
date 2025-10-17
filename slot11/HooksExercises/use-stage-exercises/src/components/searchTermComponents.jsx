/*
 * COMPONENT: searchTermComponents.jsx
 * MỤC ĐÍCH: Minh họa filtering data với useState và real-time search
  
 */

import React, { useState } from 'react';

/*
 * STATIC DATA:
 * Array chứa data để filter (thường sẽ từ API)
 */
const data = [
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Carrot', category: 'Vegetable' },
  { id: 3, name: 'Banana', category: 'Fruit' },
  { id: 4, name: 'Broccoli', category: 'Vegetable' },
];

function SearchItem() {
  /*
   * SEARCH STATE:
   * State để lưu search term từ input
   */
  const [searchTerm, setSearchTerm] = useState('');

  /*
   * COMPUTED FILTERED DATA:
   * Filter data dựa trên searchTerm với case-insensitive search
   * Chạy mỗi khi searchTerm thay đổi
   */
  const filteredList = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*
   * RETURN JSX với INLINE STYLING:
   * Component này dùng inline style thay vì React Bootstrap
   * để minh họa cách styling khác
   */
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
      {/* 
       * SEARCH INPUT:
       * Controlled component với value và onChange
       * Real-time filtering khi user nhập
       */}
      <input
        type="text"
        value={searchTerm}                                    // Controlled component
        onChange={(e) => setSearchTerm(e.target.value)}      // Update search state
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
      {/* 
       * FILTERED RESULTS LIST:
       * Render danh sách đã filter với conditional rendering
       */}
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
            <span style={{ fontWeight: 600 }}>{item.name}</span> 
            <span style={{ color: '#1976d2' }}>({item.category})</span>
          </li>
        ))}
        {/* 
         * CONDITIONAL RENDERING:
         * Hiển thị message khi không có kết quả
         */}
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