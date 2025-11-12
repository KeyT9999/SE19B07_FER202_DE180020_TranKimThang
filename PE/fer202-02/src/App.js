import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ExpenseProvider } from './contexts/ExpenseContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppRoutes />
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
