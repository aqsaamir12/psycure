import React from 'react'
import Foot_bar from './Footer';
import Nav_bar from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <Nav_bar/>
      <Outlet />
      <Foot_bar/>
    </div>
  )
}

