import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { PaymentProvider } from './contexts/PaymentContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <AppRoutes />
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;
