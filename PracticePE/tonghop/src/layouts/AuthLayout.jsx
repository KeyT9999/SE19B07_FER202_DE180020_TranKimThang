// src/layouts/AuthLayout.js

import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ToastNotifications from "../components/ToastNotifications"; // MODIFICATION: Import ToastNotifications

const AuthLayout = () => {

  return (
    <div className="auth-layout">
      <header className="auth-header">
        <Link to="/home" className="auth-back-link">
          <FaArrowLeft className="me-2" /> Back to Shop
        </Link>
      </header>
      <main className="auth-container">
        <Outlet />
      </main>
      <ToastNotifications /> {/* MODIFICATION: Add component here */}
    </div>
  );
};

export default AuthLayout;
