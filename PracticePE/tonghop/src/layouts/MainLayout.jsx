import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ToastNotifications from "../components/ToastNotifications";

const MainLayout = () => {
  return (
    <div id="root-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastNotifications />
      <Footer />
    </div>
  );
};

export default MainLayout;
