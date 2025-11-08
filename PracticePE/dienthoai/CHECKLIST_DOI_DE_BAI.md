# ✅ CHECKLIST ĐỔI ĐỀ BÀI: ĐIỆN THOẠI → MÁY ẢNH

## 📋 CHECKLIST TỔNG QUAN

### **1. ĐỔI TÊN FILE** ✅
- [ ] `src/api/PhoneAPI.js` → `src/api/CameraAPI.js`
- [ ] `src/components/PhoneList.jsx` → `src/components/CameraList.jsx`
- [ ] `src/components/ViewPhone.jsx` → `src/components/ViewCamera.jsx`
- [ ] `public/images/mobiles/` → `public/images/cameras/`

### **2. CẬP NHẬT PACKAGE.JSON** ✅
- [ ] Đổi `"name": "dienthoai"` → `"name": "mayanh"`

### **3. CẬP NHẬT API FILE** ✅
- [ ] Đổi `PhoneAPI` → `CameraAPI`
- [ ] Đổi `PhoneApi` → `CameraAPI`
- [ ] Đổi export default

### **4. CẬP NHẬT COMPONENT NAMES** ✅
- [ ] `PhoneList` → `CameraList`
- [ ] `ViewPhone` → `ViewCamera`

### **5. CẬP NHẬT VARIABLES & STATE** ✅
- [ ] `mobiles` → `cameras`
- [ ] `mobile` → `camera`
- [ ] `filteredMobiles` → `filteredCameras`
- [ ] `setMobiles` → `setCameras`
- [ ] `setMobile` → `setCamera`
- [ ] `setFilteredMobiles` → `setFilteredCameras`

### **6. CẬP NHẬT FUNCTION NAMES** ✅
- [ ] `fetchMobiles` → `fetchCameras`
- [ ] `handleAddToCart(mobile)` → `handleAddToCart(camera)`
- [ ] `handleFavourite(mobile)` → `handleFavourite(camera)`
- [ ] `addToFavourite(mobile)` → `addToFavourite(camera)`

### **7. CẬP NHẬT ROUTE PATHS** ✅
- [ ] `/mobiles` → `/cameras`
- [ ] `/mobiles/:id` → `/cameras/:id`
- [ ] `navigate("/mobiles")` → `navigate("/cameras")`
- [ ] `navigate(\`/mobiles/${id}\`)` → `navigate(\`/cameras/${id}\`)`

### **8. CẬP NHẬT API CALLS** ✅
- [ ] `PhoneAPI.get("/mobiles")` → `CameraAPI.get("/cameras")`
- [ ] `PhoneAPI.get(\`/mobiles/${id}\`)` → `CameraAPI.get(\`/cameras/${id}\`)`

### **9. CẬP NHẬT IMPORT STATEMENTS** ✅
- [ ] `import PhoneAPI from "../api/PhoneAPI"` → `import CameraAPI from "../api/CameraAPI"`
- [ ] `import PhoneList from "./components/PhoneList"` → `import CameraList from "./components/CameraList"`
- [ ] `import ViewPhone from "./components/ViewPhone"` → `import ViewCamera from "./components/ViewCamera"`

### **10. CẬP NHẬT ARRAY OPERATIONS** ✅
- [ ] `mobiles.map((mobile) =>` → `cameras.map((camera) =>`
- [ ] `filteredMobiles.map((mobile) =>` → `filteredCameras.map((camera) =>`
- [ ] `mobiles.filter((mobile) =>` → `cameras.filter((camera) =>`
- [ ] `mobile.id` → `camera.id`
- [ ] `mobile.name` → `camera.name`
- [ ] `mobile.image` → `camera.image`
- [ ] `mobile.price` → `camera.price`
- [ ] `mobile.description` → `camera.description`

### **11. CẬP NHẬT TEXT & COMMENTS** ✅
- [ ] "điện thoại" → "máy ảnh"
- [ ] "Mobile Shop" → "Camera Shop"
- [ ] "mobile shop" → "camera shop"
- [ ] "Đang tải danh sách điện thoại..." → "Đang tải danh sách máy ảnh..."
- [ ] "No mobile ID provided." → "No camera ID provided."
- [ ] "Mobile not found." → "Camera not found."
- [ ] "Back to Mobile List" → "Back to Camera List"
- [ ] "Browse mobile shop" → "Browse camera shop"

### **12. CẬP NHẬT ERROR MESSAGES** ✅
- [ ] "Không thể tải danh sách mobiles..." → "Không thể tải danh sách cameras..."
- [ ] "No mobiles found." → "No cameras found."
- [ ] "Loading mobile details..." → "Loading camera details..."

### **13. CẬP NHẬT DB.JSON** ✅
- [ ] Key `"mobiles"` → `"cameras"`
- [ ] Cập nhật dữ liệu từ điện thoại sang máy ảnh
- [ ] Cập nhật tên sản phẩm, mô tả, giá, hình ảnh

### **14. CẬP NHẬT CONTEXT FILES** ✅
- [ ] `FavouriteContext.jsx`: Đổi parameter `mobile` → `camera`
- [ ] `AuthContext.jsx`: Đổi import `PhoneAPI` → `CameraAPI`
- [ ] `CartContext.jsx`: Kiểm tra có dùng `mobile` không

### **15. CẬP NHẬT PAGES** ✅
- [ ] `HomePage.jsx`: Đổi text và route
- [ ] `FavouritePage.jsx`: Đổi text và variables
- [ ] `CartPage.jsx`: Đổi text và navigate
- [ ] `LoginForm.jsx`: Đổi navigate và comment

### **16. CẬP NHẬT NAVBAR** ✅
- [ ] "Mobile Shop" → "Camera Shop"

### **17. CẬP NHẬT APP.JS** ✅
- [ ] Import statements
- [ ] Route definitions
- [ ] Component references

### **18. KIỂM TRA & TEST** ✅
- [ ] Test hiển thị danh sách cameras
- [ ] Test xem chi tiết camera
- [ ] Test thêm vào giỏ hàng
- [ ] Test thêm vào favourites
- [ ] Test tìm kiếm cameras
- [ ] Test sắp xếp cameras
- [ ] Test điều hướng giữa các trang
- [ ] Test login và redirect đến /cameras
- [ ] Kiểm tra không còn từ khóa cũ trong code
- [ ] Kiểm tra không có lỗi console
- [ ] Kiểm tra không có lỗi linter

---

## 🎯 TỔNG KẾT

**Tổng số mục cần kiểm tra:** 100+ items

**Ưu tiên cao:**
1. ✅ Đổi tên file
2. ✅ Cập nhật import statements
3. ✅ Cập nhật route paths
4. ✅ Cập nhật db.json
5. ✅ Cập nhật API calls

**Ưu tiên trung bình:**
6. ✅ Cập nhật variables & state
7. ✅ Cập nhật function names
8. ✅ Cập nhật component names

**Ưu tiên thấp:**
9. ✅ Cập nhật text & comments
10. ✅ Cập nhật error messages

---

## 📝 GHI CHÚ

- Sử dụng **Find & Replace** trong VS Code để thay thế nhanh
- Kiểm tra **case-sensitive** (mobile vs Mobile vs MOBILE)
- Test từng chức năng sau khi thay đổi
- Commit code thường xuyên để dễ rollback nếu có lỗi

---

**Ngày hoàn thành:** _______________

**Người thực hiện:** _______________

**Ghi chú:** _______________

