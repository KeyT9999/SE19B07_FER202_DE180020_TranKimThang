import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MobileList from '../pages/MobileList';
import MobileDetail from '../pages/MobileDetail';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/mobiles' element={<MobileList />} />
      <Route path='/mobiles/:id' element={<MobileDetail />} />
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}