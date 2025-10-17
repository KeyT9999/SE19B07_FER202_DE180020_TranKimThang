import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CounterComponent from './components/CounterComponent';
import ToggleComponent from './components/ToggleComponent';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import QuestionBank from './components/QuestionBank.jsx';
import EnhancedQuestionBank from './components/EnhancedQuestionBank';

function App() {
  return (
    <div className="App">
      <CounterComponent />
      <ToggleComponent />
      <LoginForm />
      <SignUpForm />
      <QuestionBank />
      <EnhancedQuestionBank />
    </div>
  );
}

export default App;