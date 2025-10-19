import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CounterComponent from './components/CounterComponent';
import ToggleComponent from './components/ToggleComponent'; 
import LoginForm from './components/LoginFormComponents';
import SignUpForm from './components/SignUpForm';
import QuestionBank from './components/QuestionBank';
import QuestionBanks2 from './components/QuestionBanks2';
function App() {
  return (
    <>
      <CounterComponent />

      <ToggleComponent />
      <LoginForm />
      <SignUpForm />  
      <QuestionBank /> 
      <QuestionBanks2/>
    </>
  );
}

export default App;
