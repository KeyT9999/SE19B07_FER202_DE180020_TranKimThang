//áp dụng ThemeProvider và AuthProvider để bao bọc toàn bộ ứng dụng
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import LightSwitch from "./components/LightSwitch";
import CounterComponent from "./components/CounterComponent";
import LoginForm from "./components/LoginForm";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>
          <LoginForm />
          <CounterComponent />
          <LightSwitch />
      
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
