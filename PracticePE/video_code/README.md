# Video App - Hướng Dẫn Chi Tiết

Ứng dụng Video cho phép người dùng duyệt, tìm kiếm và xem video. Dự án sử dụng React, Redux Toolkit (với Redux Thunk), React Router, Bootstrap, và JSON Server.

---

## Yêu cầu hệ thống

- Node.js version 18
- npm hoặc yarn
- Code editor (VS Code)

---

## Bước 1: Khởi tạo dự án React

```bash
npx create-react-app video_code
cd video_code
```

---

## Bước 2: Cài đặt các package

```bash
npm install @reduxjs/toolkit react-redux axios react-router-dom bootstrap prop-types json-server
```

**Giải thích:**

- `@reduxjs/toolkit`: Redux Toolkit với Redux Thunk (10 điểm)
- `react-redux`: Kết nối React với Redux
- `axios`: Gọi HTTP requests
- `react-router-dom`: Điều hướng
- `bootstrap`: UI framework
- `prop-types`: Validate props
- `json-server`: REST API từ JSON

---

## Bước 3: Tạo cấu trúc thư mục

Tạo các thư mục trong `src/`:

- `src/api/`
- `src/components/`
- `src/pages/`
- `src/redux/`
- `src/redux/slices/`

---

## Bước 4: Tạo file db.json

**Đường dẫn:** `video_code/db.json` (ngang cấp với `src/`)

**Nội dung:** Xem file db.json hiện tại

**Lưu ý:** File này chứa dữ liệu videos sẽ được JSON Server sử dụng.

---

## Bước 5: Tạo Axios instance

**File:** `src/api/videoAPI.js`

```javascript
import axios from "axios";

const videoAPI = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

export default videoAPI;
```

---

## Bước 6: Tạo Redux Store và Slice

### File 1: `src/redux/slices/videoSlice.js`

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import videoAPI from "../../api/videoAPI";

export const fetchVideos = createAsyncThunk("videos/fetchVideos", async () => {
  const response = await videoAPI.get("/videos");
  return response.data;
});

const videoSlice = createSlice({
  name: "videos",
  initialState: { videos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default videoSlice.reducer;
```

**Giải thích:**

- `createAsyncThunk`: Tạo async action (tự động xử lý pending/fulfilled/rejected)
- `createSlice`: Tạo Redux slice
- Đây là cách Redux Toolkit tích hợp Redux Thunk

### File 2: `src/redux/store.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";

const store = configureStore({
  reducer: {
    videos: videoReducer,
  },
});

export default store;
```

---

## Bước 7: Tạo Component Video với PropTypes

**File:** `src/components/Video.jsx`

```javascript
import React from "react";
import PropTypes from "prop-types";

const Video = ({ video }) => {
  return (
    <div className="card mb-4 shadow-sm">
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          width="560"
          height="315"
          src={video.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
      <div className="card-body">
        <h5 className="card-title">{video.title}</h5>
        <p className="card-text">{video.description}</p>
        <h6>Comments:</h6>
        {video.comments.length > 0 ? (
          <ul className="list-group list-group-flush">
            {video.comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                <strong>{comment.user}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

Video.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Video;
```

**Giải thích:**

- iframe embed YouTube với đầy đủ attributes
- Responsive iframe (padding-bottom: 56.25% = 16:9)
- PropTypes validation đúng yêu cầu (2 điểm)

---

## Bước 8: Tạo trang Home

**File:** `src/pages/Home.jsx`

```javascript
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron bg-light p-5 rounded shadow">
        <h1 className="display-4">Welcome to Video App</h1>
        <p className="lead">
          Browse and watch amazing videos from our collection.
        </p>
        <hr className="my-4" />
        <p>Click the button below to explore our video library.</p>
        <Link to="/videos" className="btn btn-primary btn-lg">
          Browse Videos
        </Link>
      </div>
    </div>
  );
};

export default Home;
```

---

## Bước 9: Tạo trang Videos với Redux

**File:** `src/pages/Videos.jsx`

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../redux/slices/videoSlice";
import Video from "../components/Video";

const Videos = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>Error loading videos: {error}</p>
          <p className="mb-0">
            Please make sure JSON Server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Video Library</h2>
      {videos.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No videos available.
        </div>
      ) : (
        <div className="row">
          {videos.map((video) => (
            <div key={video.id} className="col-12 col-md-6 col-lg-4">
              <Video video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
```

**Giải thích:**

- `useDispatch()`: Dispatch actions (fetchVideos thunk)
- `useSelector()`: Lấy state từ Redux store
- `useEffect()`: Fetch videos khi component mount
- Responsive grid: col-12 (mobile), col-md-6 (tablet), col-lg-4 (desktop)

---

## Bước 10: Setup React Router

**File:** `src/App.js`

```javascript
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Video App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/videos">
                  Videos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## Bước 11: Styling với Bootstrap và CSS

**File:** `src/App.css`

```css
body {
  background-color: #f8f9fa;
}

.jumbotron {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
}

.jumbotron h1 {
  color: white;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

@media (max-width: 768px) {
  .jumbotron h1 {
    font-size: 2rem;
  }
}
```

**File:** `public/index.html` - Thêm Bootstrap JS trước `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

---

## Bước 12: Wrap App với Redux Provider

**File:** `src/index.js`

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## Chạy ứng dụng

### Terminal 1 - JSON Server:

```bash
cd video_code
npx json-server --watch db.json --port 3001
```

### Terminal 2 - React App:

```bash
cd video_code
npm start
```

**Lưu ý:** Phải chạy CẢ HAI terminal cùng lúc!

---

## Checklist điểm số

✅ Component Home (1 điểm)  
✅ Component Video với iframe (3 điểm)  
✅ PropTypes validation (2 điểm)  
✅ Fetch từ JSON Server (1 điểm)  
✅ React Router (1 điểm)  
✅ Bootstrap UI responsive (1 điểm)  
✅ Redux Toolkit + Redux Thunk (1 điểm)

**Tổng: 10/10 điểm**

---

## Cấu trúc dự án

```
video_code/
├── db.json
├── src/
│   ├── api/videoAPI.js
│   ├── components/Video.jsx
│   ├── pages/Home.jsx
│   ├── pages/Videos.jsx
│   ├── redux/store.js
│   ├── redux/slices/videoSlice.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── README.md
```

---

## Đóng gói để nộp

1. Xóa node_modules: `Remove-Item -Recurse -Force node_modules`
2. Nén thành zip: Click phải thư mục → "Compressed folder"
3. Đổi tên: `Video_code.zip`
4. Kiểm tra: KHÔNG có node_modules trong zip

---

Chúc bạn thành công! 🎉
