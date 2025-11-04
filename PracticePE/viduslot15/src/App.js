// App: entry component của ứng dụng React (không chứa logic nghiệp vụ)
// - Import Bootstrap CSS và App.css
// - Render trang MovieManager
import './App.css';
import MovieManager from './pages/MovieManager';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      {/* Trong ứng dụng lớn hơn, đây sẽ là nơi bạn đặt Router (ví dụ: React Router DOM)
        và các thành phần Layout chung (Header, Footer, Sidebar). 
      */}
      <MovieManager />
{/* Nếu bạn có nhiều trang (ví dụ: /home, /about, /movies), 
        bạn sẽ sử dụng Router ở đây để hiển thị MovieManager khi cần. 
      */}
    </div>
  );
}

export default App;
