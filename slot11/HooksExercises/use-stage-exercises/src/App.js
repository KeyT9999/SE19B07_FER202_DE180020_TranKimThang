import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CounterComponent from './components/CounterComponent';
import LightSwitch from './components/LightSwitchComponents';
import LoginForm from './components/LoginFormComponents';
import LoginForm2 from './components/LoginForm2Components';
import SearchItem from './components/searchTermComponents';
import AccountSearch from './components/AccountSearchComponents';
import RegisterForm from './components/RegisterFormComponents';

function App() {
  return (
    <div className="container mt-5">
      <CounterComponent />
      <LightSwitch />
      <LoginForm />
      <LoginForm2 />
      <SearchItem />
      <AccountSearch />
      <RegisterForm />
    </div>
  );
}

export default App;
