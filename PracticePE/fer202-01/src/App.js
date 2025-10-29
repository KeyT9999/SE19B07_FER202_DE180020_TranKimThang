import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Navbar />
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
