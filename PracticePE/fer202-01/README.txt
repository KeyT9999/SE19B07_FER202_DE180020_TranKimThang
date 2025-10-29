FER202 PRACTICAL EXAMINATION 01
===================================

CÁC PACKAGE ĐÃ CÀI ĐẶT:
- axios
- prop-types
- react
- react-dom
- react-bootstrap
- react-router-dom
- react-icons
- bootstrap
- json-server

CÁCH CHẠY ỨNG DỤNG:
====================

1. Mở Terminal/PowerShell và chạy JSON Server:
   npx json-server --watch db.json --port 3000

2. Terminal khác hoặc giữ nguyên terminal hiện tại, chạy React App:
   npm start

3. Mở trình duyệt: http://localhost:3000

LƯU Ý:
- JSON Server CẦN chạy trên PORT 3000 để lấy dữ liệu mobile và login
- Nếu không chạy JSON Server, carousel và products sẽ dùng fallback data
- Để test Login: admin/123456 hoặc user1/password123

FEATURES ĐÃ HOÀN THÀNH:
- ✅ Navigation bar với Home, Favourite, Cart, Login
- ✅ Home page với carousel 3 ảnh
- ✅ Mobile List với search, filter, sort
- ✅ Mobile Detail với back button
- ✅ Login với validation và modal success
- ✅ 404 Page
- ✅ PropTypes validation
- ✅ useReducer & useContext cho state management
- ✅ Axios cho API calls
- ✅ React Bootstrap styling
