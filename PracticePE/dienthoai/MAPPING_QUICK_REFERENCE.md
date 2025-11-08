# 🚀 QUICK REFERENCE: MAPPING ĐIỆN THOẠI → MÁY ẢNH

## 📊 BẢNG MAPPING NHANH

### **FILE NAMES**
```
PhoneAPI.js          → CameraAPI.js
PhoneList.jsx        → CameraList.jsx
ViewPhone.jsx        → ViewCamera.jsx
images/mobiles/      → images/cameras/
```

### **PACKAGE.JSON**
```json
"name": "dienthoai"  → "name": "mayanh"
```

### **IMPORTS**
```javascript
PhoneAPI             → CameraAPI
PhoneList            → CameraList
ViewPhone            → ViewCamera
```

### **COMPONENT NAMES**
```javascript
PhoneList()          → CameraList()
ViewPhone()          → ViewCamera()
```

### **VARIABLES & STATE**
```javascript
mobiles              → cameras
mobile               → camera
filteredMobiles      → filteredCameras
setMobiles           → setCameras
setMobile            → setCamera
setFilteredMobiles   → setFilteredCameras
```

### **FUNCTION NAMES**
```javascript
fetchMobiles()       → fetchCameras()
handleAddToCart(mobile) → handleAddToCart(camera)
handleFavourite(mobile) → handleFavourite(camera)
addToFavourite(mobile)  → addToFavourite(camera)
```

### **ROUTE PATHS**
```javascript
/mobiles             → /cameras
/mobiles/:id         → /cameras/:id
navigate("/mobiles") → navigate("/cameras")
```

### **API CALLS**
```javascript
PhoneAPI.get("/mobiles")        → CameraAPI.get("/cameras")
PhoneAPI.get(`/mobiles/${id}`)  → CameraAPI.get(`/cameras/${id}`)
```

### **ARRAY OPERATIONS**
```javascript
mobiles.map((mobile) =>        → cameras.map((camera) =>
filteredMobiles.map((mobile) => → filteredCameras.map((camera) =>
mobile.id                      → camera.id
mobile.name                    → camera.name
mobile.image                   → camera.image
mobile.price                   → camera.price
mobile.description             → camera.description
```

### **TEXT & STRINGS**
```javascript
"điện thoại"        → "máy ảnh"
"Mobile Shop"       → "Camera Shop"
"mobile shop"       → "camera shop"
"No mobile ID"      → "No camera ID"
"Mobile not found"  → "Camera not found"
"Back to Mobile List" → "Back to Camera List"
```

### **DB.JSON**
```json
"mobiles"           → "cameras"
```

---

## 🔍 FIND & REPLACE COMMANDS

### **VS Code Find & Replace (Ctrl + H)**

1. `PhoneAPI` → `CameraAPI`
2. `PhoneList` → `CameraList`
3. `ViewPhone` → `ViewCamera`
4. `mobile` → `camera` (case-sensitive)
5. `Mobile` → `Camera`
6. `mobiles` → `cameras`
7. `Mobiles` → `Cameras`
8. `/mobiles` → `/cameras`
9. `điện thoại` → `máy ảnh`
10. `dienthoai` → `mayanh`

---

## ⚡ QUICK STEPS

1. **Đổi tên file** → Rename files
2. **Find & Replace** → Thay thế từ khóa
3. **Cập nhật db.json** → Đổi key "mobiles" → "cameras"
4. **Test** → Kiểm tra các chức năng

---

**Xem chi tiết:** `HUONG_DAN_DOI_DE_BAI.md`
**Checklist:** `CHECKLIST_DOI_DE_BAI.md`

