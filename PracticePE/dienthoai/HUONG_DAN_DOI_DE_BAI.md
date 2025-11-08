# 📋 HƯỚNG DẪN ĐỔI ĐỀ BÀI TỪ ĐIỆN THOẠI SANG MÁY ẢNH

## 🎯 MỤC ĐÍCH
Tài liệu này hướng dẫn chi tiết cách chuyển đổi code từ đề bài **"Điện thoại" (Phone/Mobile)** sang đề bài **"Máy ảnh" (Camera)**.

---

## 📊 BẢNG MAPPING TỪ KHÓA

| **ĐIỆN THOẠI (Cũ)** | **MÁY ẢNH (Mới)** | **Ghi chú** |
|---------------------|-------------------|-------------|
| `phone` / `Phone` | `camera` / `Camera` | Tên biến, hàm, component |
| `mobile` / `Mobile` | `camera` / `Camera` | Tên biến, state, props |
| `mobiles` / `Mobiles` | `cameras` / `Cameras` | Tên mảng, collection |
| `dienthoai` | `mayanh` | Tên package, folder |
| `điện thoại` | `máy ảnh` | Text hiển thị, comments |
| `smartphone` | `máy ảnh` | Text hiển thị |
| `/mobiles` | `/cameras` | Route path |
| `/mobiles/:id` | `/cameras/:id` | Route path với param |
| `PhoneAPI` | `CameraAPI` | API instance |
| `PhoneList` | `CameraList` | Component name |
| `ViewPhone` | `ViewCamera` | Component name |
| `images/mobiles` | `images/cameras` | Folder images |

---

## 📁 DANH SÁCH FILE CẦN ĐỔI TÊN

### 1. **API Files**
```
❌ src/api/PhoneAPI.js
✅ src/api/CameraAPI.js
```

### 2. **Component Files**
```
❌ src/components/PhoneList.jsx
✅ src/components/CameraList.jsx

❌ src/components/ViewPhone.jsx
✅ src/components/ViewCamera.jsx
```

### 3. **Image Folders** (trong `public/images/`)
```
❌ public/images/mobiles/
✅ public/images/cameras/
```

### 4. **Package Name** (trong `package.json`)
```
❌ "name": "dienthoai"
✅ "name": "mayanh"  (hoặc "camera-shop")
```

---

## 🔍 CÁC TỪ KHÓA CẦN THAY THẾ TRONG CODE

### 1. **Import Statements**

#### ❌ Trước:
```javascript
import PhoneAPI from "../api/PhoneAPI";
import PhoneList from "./components/PhoneList";
import ViewPhone from "./components/ViewPhone";
```

#### ✅ Sau:
```javascript
import CameraAPI from "../api/CameraAPI";
import CameraList from "./components/CameraList";
import ViewCamera from "./components/ViewCamera";
```

---

### 2. **Component Names**

#### ❌ Trước:
```javascript
function PhoneList() { ... }
function ViewPhone() { ... }
```

#### ✅ Sau:
```javascript
function CameraList() { ... }
function ViewCamera() { ... }
```

---

### 3. **Variable Names & State**

#### ❌ Trước:
```javascript
const [mobiles, setMobiles] = useState([]);
const [mobile, setMobile] = useState(null);
const [filteredMobiles, setFilteredMobiles] = useState([]);
```

#### ✅ Sau:
```javascript
const [cameras, setCameras] = useState([]);
const [camera, setCamera] = useState(null);
const [filteredCameras, setFilteredCameras] = useState([]);
```

---

### 4. **API Calls**

#### ❌ Trước:
```javascript
const response = await PhoneAPI.get("/mobiles");
const response = await PhoneAPI.get(`/mobiles/${id}`);
```

#### ✅ Sau:
```javascript
const response = await CameraAPI.get("/cameras");
const response = await CameraAPI.get(`/cameras/${id}`);
```

---

### 5. **Function Names**

#### ❌ Trước:
```javascript
const fetchMobiles = async () => { ... }
const handleAddToCart = (mobile) => { ... }
const handleFavourite = (mobile) => { ... }
```

#### ✅ Sau:
```javascript
const fetchCameras = async () => { ... }
const handleAddToCart = (camera) => { ... }
const handleFavourite = (camera) => { ... }
```

---

### 6. **Route Paths**

#### ❌ Trước:
```javascript
<Route path="/mobiles" element={<PhoneList />} />
<Route path="/mobiles/:id" element={<ViewPhone />} />
navigate("/mobiles");
navigate(`/mobiles/${id}`);
```

#### ✅ Sau:
```javascript
<Route path="/cameras" element={<CameraList />} />
<Route path="/cameras/:id" element={<ViewCamera />} />
navigate("/cameras");
navigate(`/cameras/${id}`);
```

---

### 7. **Context Functions** (FavouriteContext, CartContext)

#### ❌ Trước:
```javascript
const addToFavourite = (mobile) => { ... }
addToCart(mobile);
addToFavourite(mobile);
```

#### ✅ Sau:
```javascript
const addToFavourite = (camera) => { ... }
addToCart(camera);
addToFavourite(camera);
```

---

### 8. **Array Operations (map, filter)**

#### ❌ Trước:
```javascript
{mobiles.map((mobile) => (
  <div key={mobile.id}>{mobile.name}</div>
))}

{filteredMobiles.filter((mobile) => 
  mobile.name.includes(searchTerm)
)}
```

#### ✅ Sau:
```javascript
{cameras.map((camera) => (
  <div key={camera.id}>{camera.name}</div>
))}

{filteredCameras.filter((camera) => 
  camera.name.includes(searchTerm)
)}
```

---

### 9. **Comments & Text Display**

#### ❌ Trước:
```javascript
// Đang tải danh sách điện thoại...
// No mobile ID provided.
// Mobile not found.
"Điện thoại"
"Mobile Shop"
"Browse mobile shop"
```

#### ✅ Sau:
```javascript
// Đang tải danh sách máy ảnh...
// No camera ID provided.
// Camera not found.
"Máy ảnh"
"Camera Shop"
"Browse camera shop"
```

---

### 10. **Error Messages**

#### ❌ Trước:
```javascript
setError("No mobile ID provided.");
setError("Mobile not found.");
setError("Không thể tải danh sách mobiles...");
```

#### ✅ Sau:
```javascript
setError("No camera ID provided.");
setError("Camera not found.");
setError("Không thể tải danh sách cameras...");
```

---

## 📝 HƯỚNG DẪN TỪNG BƯỚC

### **BƯỚC 1: Đổi tên file và folder**

#### 1.1. Đổi tên file API
```bash
# Trong thư mục src/api/
mv PhoneAPI.js CameraAPI.js
```

#### 1.2. Đổi tên component files
```bash
# Trong thư mục src/components/
mv PhoneList.jsx CameraList.jsx
mv ViewPhone.jsx ViewCamera.jsx
```

#### 1.3. Đổi tên image folder
```bash
# Trong thư mục public/images/
mv mobiles cameras
```

---

### **BƯỚC 2: Cập nhật package.json**

#### File: `package.json`
```json
{
  "name": "mayanh",  // ❌ Đổi từ "dienthoai"
  "version": "0.1.0",
  ...
}
```

---

### **BƯỚC 3: Cập nhật API File**

#### File: `src/api/CameraAPI.js` (đã đổi tên)
```javascript
import axios from "axios";

const CameraAPI = axios.create({  // ❌ Đổi từ PhoneAPI
  baseURL: "http://localhost:3001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default CameraAPI;  // ❌ Đổi từ PhoneApi
```

---

### **BƯỚC 4: Cập nhật App.js**

#### File: `src/App.js`

##### 4.1. Đổi import statements:
```javascript
// ❌ Xóa:
import PhoneList from "./components/PhoneList";
import ViewPhone from "./components/ViewPhone";

// ✅ Thêm:
import CameraList from "./components/CameraList";
import ViewCamera from "./components/ViewCamera";
```

##### 4.2. Đổi routes:
```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/cameras" element={<CameraList />} />  // ❌ Đổi từ /mobiles và PhoneList
  <Route path="/cameras/:id" element={<ViewCamera />} />  // ❌ Đổi từ /mobiles/:id và ViewPhone
  <Route path="/login" element={<LoginForm />} />
  <Route path="/favourite" element={<FavouritePage />} />
  <Route path="/cart" element={<CartPage />} />
</Routes>
```

---

### **BƯỚC 5: Cập nhật CameraList.jsx** (đã đổi tên từ PhoneList.jsx)

#### File: `src/components/CameraList.jsx`

##### 5.1. Đổi import:
```javascript
import CameraAPI from "../api/CameraAPI";  // ❌ Đổi từ PhoneAPI
```

##### 5.2. Đổi component name:
```javascript
function CameraList() {  // ❌ Đổi từ PhoneList
  ...
}
```

##### 5.3. Đổi state variables:
```javascript
const [cameras, setCameras] = useState([]);  // ❌ Đổi từ mobiles
const [filteredCameras, setFilteredCameras] = useState([]);  // ❌ Đổi từ filteredMobiles
```

##### 5.4. Đổi API calls:
```javascript
const fetchCameras = async () => {  // ❌ Đổi từ fetchMobiles
  try {
    const response = await CameraAPI.get("/cameras");  // ❌ Đổi từ /mobiles
    setCameras(response.data);  // ❌ Đổi từ setMobiles
    setFilteredCameras(response.data);  // ❌ Đổi từ setFilteredMobiles
  } catch (err) {
    setError(`Không thể tải danh sách cameras...`);  // ❌ Đổi từ mobiles
  }
};
```

##### 5.5. Đổi filter operations:
```javascript
useEffect(() => {
  let filtered = [...cameras];  // ❌ Đổi từ mobiles
  
  if (searchTerm) {
    filtered = filtered.filter((camera) =>  // ❌ Đổi từ mobile
      camera.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  setFilteredCameras(filtered);  // ❌ Đổi từ setFilteredMobiles
}, [searchTerm, sortOrder, cameras]);  // ❌ Đổi từ mobiles
```

##### 5.6. Đổi function parameters:
```javascript
const handleAddToCart = (camera) => {  // ❌ Đổi từ mobile
  addToCart(camera);  // ❌ Đổi từ mobile
  setSuccessMessage(`${camera.name} has been added to your cart.`);  // ❌ Đổi từ mobile
};

const handleFavourite = (camera) => {  // ❌ Đổi từ mobile
  if (isFavourite(camera.id)) {  // ❌ Đổi từ mobile
    setSuccessMessage(`${camera.name} is already in your favourites.`);  // ❌ Đổi từ mobile
  } else {
    addToFavourite(camera);  // ❌ Đổi từ mobile
    setSuccessMessage(`${camera.name} has been added to your favourites.`);  // ❌ Đổi từ mobile
  }
};
```

##### 5.7. Đổi render:
```javascript
{filteredCameras.map((camera) => {  // ❌ Đổi từ filteredMobiles và mobile
  return (
    <Col key={camera.id}>  // ❌ Đổi từ mobile.id
      <Card>
        <Card.Img src={getImageSrc(camera.image)} alt={camera.name} />  // ❌ Đổi từ mobile
        <Card.Body>
          <Card.Title>{camera.name}</Card.Title>  // ❌ Đổi từ mobile
          <Card.Text>{camera.description}</Card.Text>  // ❌ Đổi từ mobile
          <Button onClick={() => navigate(`/cameras/${camera.id}`)}>  // ❌ Đổi từ /mobiles và mobile.id
            View Details
          </Button>
          <Button onClick={() => handleAddToCart(camera)}>  // ❌ Đổi từ mobile
            Add to Cart
          </Button>
          <Button onClick={() => handleFavourite(camera)}>  // ❌ Đổi từ mobile
            {isFavourite(camera.id) ? "❤️ Favourited" : "❤️ Favourite"}  // ❌ Đổi từ mobile.id
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
})}
```

##### 5.8. Đổi loading/error messages:
```javascript
<p>Đang tải danh sách máy ảnh...</p>  // ❌ Đổi từ điện thoại
<Alert variant="info">No cameras found.</Alert>  // ❌ Đổi từ mobiles
```

---

### **BƯỚC 6: Cập nhật ViewCamera.jsx** (đã đổi tên từ ViewPhone.jsx)

#### File: `src/components/ViewCamera.jsx`

##### 6.1. Đổi import:
```javascript
import CameraAPI from "../api/CameraAPI";  // ❌ Đổi từ PhoneAPI
```

##### 6.2. Đổi component name:
```javascript
function ViewCamera() {  // ❌ Đổi từ ViewPhone
  ...
}
```

##### 6.3. Đổi state:
```javascript
const [camera, setCamera] = useState(null);  // ❌ Đổi từ mobile
```

##### 6.4. Đổi API call:
```javascript
const fetchCamera = async () => {  // ❌ Đổi từ fetchMobile
  if (!id) {
    setError("No camera ID provided.");  // ❌ Đổi từ mobile
    return;
  }
  
  try {
    const response = await CameraAPI.get(`/cameras/${id}`);  // ❌ Đổi từ /mobiles
    setCamera(response.data);  // ❌ Đổi từ setMobile
  } catch (error) {
    setError("Camera not found.");  // ❌ Đổi từ Mobile
  }
};
```

##### 6.5. Đổi render:
```javascript
if (!camera) {  // ❌ Đổi từ mobile
  return (
    <Alert>
      <Alert.Heading>No camera found</Alert.Heading>  // ❌ Đổi từ mobile
      <p>Camera not found.</p>  // ❌ Đổi từ Mobile
      <Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
        Back to Camera List  // ❌ Đổi từ Mobile List
      </Button>
    </Alert>
  );
}

return (
  <Card>
    <Card.Img src={getImageSrc(camera.image)} alt={camera.name || "Camera"} />  // ❌ Đổi từ Mobile
    <Card.Body>
      <Card.Title>{camera.name || "Unknown Camera"}</Card.Title>  // ❌ Đổi từ Mobile
      <Card.Text>{camera.description || "N/A"}</Card.Text>
      <Button onClick={() => addToCart(camera)}>Add to Cart</Button>  // ❌ Đổi từ mobile
      <Button onClick={() => handleFavourite(camera)}>  // ❌ Đổi từ mobile
        {isFavourite(camera.id) ? "❤️ Favourited" : "❤️ Favourite"}  // ❌ Đổi từ mobile.id
      </Button>
      <Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
        Back to Camera List  // ❌ Đổi từ Mobile List
      </Button>
    </Card.Body>
  </Card>
);
```

---

### **BƯỚC 7: Cập nhật Context Files**

#### File: `src/context/FavouriteContext.jsx`

##### 7.1. Đổi function parameter:
```javascript
const addToFavourite = (camera) => {  // ❌ Đổi từ mobile
  dispatch({ type: "ADD_TO_FAVOURITE", payload: camera });  // ❌ Đổi từ mobile
};
```

---

#### File: `src/context/AuthContext.jsx`

##### 7.1. Đổi import:
```javascript
import CameraAPI from "../api/CameraAPI";  // ❌ Đổi từ PhoneAPI
```

##### 7.2. Đổi API call (nếu có):
```javascript
const response = await CameraAPI.get("/accounts");  // Giữ nguyên, không cần đổi
```

---

### **BƯỚC 8: Cập nhật Pages**

#### File: `src/pages/HomePage.jsx`

##### 8.1. Đổi text và images:
```javascript
<Carousel.Caption>
  <h1>Camera DSLR</h1>  // ❌ Đổi từ iPhone 16
  <p>Hiệu năng chụp ảnh chuyên nghiệp, chất lượng cao.</p>  // ❌ Đổi từ smartphone
</Carousel.Caption>

<h1>Latest Cameras</h1>  // ❌ Đổi từ Latest Models
<p>Khám phá những máy ảnh mới nhất.</p>  // ❌ Đổi từ smartphone

<h1>Great Deals</h1>
<p>Ưu đãi đặc biệt cho máy ảnh cao cấp.</p>  // ❌ Đổi từ điện thoại

<p>The best place to buy camera shop online...</p>  // ❌ Đổi từ mobile shop

<Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
  Browse camera shop →  // ❌ Đổi từ mobile shop
</Button>
```

---

#### File: `src/pages/FavouritePage.jsx`

##### 8.1. Đổi text và variables:
```javascript
<p>Add some cameras to your favourites...</p>  // ❌ Đổi từ mobiles
<Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
  Browse Cameras  // ❌ Đổi từ Mobiles
</Button>

{items.map((camera) => {  // ❌ Đổi từ mobile
  return (
    <Col key={camera.id}>  // ❌ Đổi từ mobile.id
      <Card>
        <Card.Img src={getImageSrc(camera.image)} alt={camera.name} />  // ❌ Đổi từ mobile
        <Card.Title>{camera.name}</Card.Title>  // ❌ Đổi từ mobile
        <Button onClick={() => navigate(`/cameras/${camera.id}`)}>  // ❌ Đổi từ /mobiles và mobile.id
          View Details
        </Button>
        <Button onClick={() => removeFromFavourite(camera.id)}>  // ❌ Đổi từ mobile.id
          Remove
        </Button>
      </Card>
    </Col>
  );
})}
```

---

#### File: `src/pages/CartPage.jsx`

##### 8.1. Đổi text và navigate:
```javascript
<p>Add some cameras to your cart...</p>  // ❌ Đổi từ mobiles
<Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
  Browse Cameras  // ❌ Đổi từ Mobiles
</Button>

<Button onClick={() => navigate("/cameras")}>  // ❌ Đổi từ /mobiles
  Continue Shopping
</Button>
```

---

#### File: `src/components/LoginForm.jsx`

##### 8.1. Đổi navigate và comment:
```javascript
// Sau 2 giây → chuyển đến trang danh sách máy ảnh  // ❌ Đổi từ điện thoại
setTimeout(() => {
  navigate("/cameras");  // ❌ Đổi từ /mobiles
}, 2000);
```

---

#### File: `src/components/NavBar.jsx`

##### 8.1. Đổi text:
```javascript
<Link to="/">Camera Shop</Link>  // ❌ Đổi từ Mobile Shop
```

---

### **BƯỚC 9: Cập nhật db.json**

#### File: `db.json`

##### 9.1. Đổi key name:
```json
{
  "cameras": [  // ❌ Đổi từ "mobiles"
    {
      "id": 1,
      "name": "Canon EOS R5",
      "description": "Máy ảnh mirrorless full-frame với độ phân giải 45MP, quay video 8K, hệ thống lấy nét tự động Dual Pixel CMOS AF II.",
      "price": 89990000,
      "image": "https://example.com/canon-eos-r5.jpg"
    },
    {
      "id": 2,
      "name": "Sony A7 IV",
      "description": "Máy ảnh mirrorless full-frame với độ phân giải 33MP, quay video 4K 60fps, hệ thống ổn định hình ảnh 5 trục.",
      "price": 69990000,
      "image": "https://example.com/sony-a7iv.jpg"
    },
    {
      "id": 3,
      "name": "Nikon Z9",
      "description": "Máy ảnh mirrorless full-frame với độ phân giải 45.7MP, quay video 8K 60fps, chụp liên tiếp 20fps.",
      "price": 129990000,
      "image": "https://example.com/nikon-z9.jpg"
    }
  ],
  "accounts": [ ... ]  // Giữ nguyên
}
```

---

### **BƯỚC 10: Kiểm tra và Test**

#### 10.1. Checklist:
- [ ] Đã đổi tên tất cả file (PhoneAPI → CameraAPI, PhoneList → CameraList, ViewPhone → ViewCamera)
- [ ] Đã đổi tên folder images (mobiles → cameras)
- [ ] Đã cập nhật package.json (name: "mayanh")
- [ ] Đã thay thế tất cả `phone/Phone` → `camera/Camera`
- [ ] Đã thay thế tất cả `mobile/Mobile` → `camera/Camera`
- [ ] Đã thay thế tất cả `mobiles/Mobiles` → `cameras/Cameras`
- [ ] Đã thay thế tất cả `/mobiles` → `/cameras`
- [ ] Đã thay thế tất cả text "điện thoại" → "máy ảnh"
- [ ] Đã cập nhật db.json (key "mobiles" → "cameras")
- [ ] Đã cập nhật tất cả import statements
- [ ] Đã cập nhật tất cả component names
- [ ] Đã cập nhật tất cả function names
- [ ] Đã cập nhật tất cả variable names
- [ ] Đã cập nhật tất cả route paths
- [ ] Đã cập nhật tất cả error messages
- [ ] Đã cập nhật tất cả comments

#### 10.2. Test các chức năng:
- [ ] Test hiển thị danh sách cameras
- [ ] Test xem chi tiết camera
- [ ] Test thêm vào giỏ hàng
- [ ] Test thêm vào favourites
- [ ] Test tìm kiếm cameras
- [ ] Test sắp xếp cameras
- [ ] Test điều hướng giữa các trang
- [ ] Test login và redirect đến /cameras

---

## 🛠️ CÔNG CỤ HỖ TRỢ TÌM VÀ THAY THẾ

### **Sử dụng VS Code Find & Replace:**

1. **Mở Find & Replace:**
   - Nhấn `Ctrl + H` (Windows) hoặc `Cmd + H` (Mac)

2. **Thay thế từng từ khóa:**
   - Tìm: `PhoneAPI` → Thay: `CameraAPI`
   - Tìm: `PhoneList` → Thay: `CameraList`
   - Tìm: `ViewPhone` → Thay: `ViewCamera`
   - Tìm: `mobile` → Thay: `camera` (chú ý case-sensitive)
   - Tìm: `Mobile` → Thay: `Camera`
   - Tìm: `mobiles` → Thay: `cameras`
   - Tìm: `Mobiles` → Thay: `Cameras`
   - Tìm: `/mobiles` → Thay: `/cameras`
   - Tìm: `điện thoại` → Thay: `máy ảnh`
   - Tìm: `dienthoai` → Thay: `mayanh`

3. **Chọn scope:**
   - Chọn "Replace All" để thay thế tất cả
   - Hoặc chọn "Replace" để thay thế từng instance

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Case-sensitive:**
   - `mobile` khác với `Mobile`
   - `phone` khác với `Phone`
   - Phải thay thế từng trường hợp riêng biệt

2. **Context-specific:**
   - Một số từ có thể xuất hiện trong comments, strings, hoặc code
   - Cần kiểm tra kỹ trước khi thay thế

3. **File names:**
   - Đổi tên file trước, sau đó mới cập nhật import statements
   - Nếu không, sẽ bị lỗi import

4. **db.json:**
   - Phải đổi key "mobiles" thành "cameras" trong db.json
   - Nếu không, API sẽ không tìm thấy dữ liệu

5. **Routes:**
   - Phải đổi tất cả route paths (`/mobiles` → `/cameras`)
   - Nếu không, điều hướng sẽ bị lỗi

6. **Images:**
   - Phải đổi tên folder images (`mobiles` → `cameras`)
   - Cập nhật đường dẫn images trong code nếu cần

---

## 📚 VÍ DỤ HOÀN CHỈNH

### **Trước (Điện thoại):**
```javascript
// src/components/PhoneList.jsx
import PhoneAPI from "../api/PhoneAPI";

function PhoneList() {
  const [mobiles, setMobiles] = useState([]);
  
  const fetchMobiles = async () => {
    const response = await PhoneAPI.get("/mobiles");
    setMobiles(response.data);
  };
  
  return (
    <div>
      {mobiles.map((mobile) => (
        <div key={mobile.id}>{mobile.name}</div>
      ))}
    </div>
  );
}
```

### **Sau (Máy ảnh):**
```javascript
// src/components/CameraList.jsx
import CameraAPI from "../api/CameraAPI";

function CameraList() {
  const [cameras, setCameras] = useState([]);
  
  const fetchCameras = async () => {
    const response = await CameraAPI.get("/cameras");
    setCameras(response.data);
  };
  
  return (
    <div>
      {cameras.map((camera) => (
        <div key={camera.id}>{camera.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎉 KẾT LUẬN

Sau khi hoàn thành tất cả các bước trên, bạn sẽ có một ứng dụng mới hoàn toàn về **Máy ảnh** thay vì **Điện thoại**. 

**Nhớ:**
- Kiểm tra lại tất cả các file đã được cập nhật
- Test các chức năng chính
- Đảm bảo không còn từ khóa cũ nào trong code
- Cập nhật README.md nếu có

Chúc bạn thành công! 🚀

