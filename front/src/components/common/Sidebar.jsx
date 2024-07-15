import React, { useEffect, useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarFooter,
} from 'cdbreact';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ toggleSidebar, isSidebarActive }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };
  
 // Function to set the active item based on the current URL
 const setActiveItemFromUrl = () => {
  const currentPath = location.pathname;
  const relativePath = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  setActiveItem(relativePath);
};

// Set the active item when the component mounts or when the location changes
useEffect(() => {
  setActiveItemFromUrl();
}, [location.pathname]);

  return (
    <CDBSidebar>
      <CDBSidebarHeader
        id="font-txt"
        className="my_side_bar"
        prefix={<i id="font-txt" className="fa fa-bars " />}
        onClick={toggleSidebar} // Add onClick event to toggle the sidebar
      ></CDBSidebarHeader>
      <CDBSidebarContent className="my_side_bar">
    <CDBSidebarMenu className="my_side_bar side-bar-height">
      <Link to={user?.isTherapist ? '/therapist/dashboard' : '/users/dashboard'} className='act'>
        <CDBSidebarMenuItem
          id="font-txt"
          icon="th-large"
          className={activeItem === 'dashboard' ? 'dash_active' : ''}
          onClick={() => handleItemClick('dashboard')}
        >
          Dashboard
        </CDBSidebarMenuItem>
      </Link>
      <Link to='/users/book-appointments'>
      {!user?.isTherapist && (
        <CDBSidebarMenuItem
          id="font-txt"
          icon="sticky-note"
          className={activeItem === 'book-appointments' ? 'dash_active' : ''}
          onClick={() => handleItemClick('book-appointments')}
        >
          Book Appointment
        </CDBSidebarMenuItem>
       )}
      </Link>
      <Link to='/users/schedule'>
        <CDBSidebarMenuItem
          id="font-txt"
          icon="sticky-note"
          className={activeItem === 'schedule' ? 'dash_active' : ''}
          onClick={() => handleItemClick('schedule')}
        >
          Schedule
        </CDBSidebarMenuItem>
      </Link>
      <Link to='/therapist/availability'>
      {user?.isTherapist && (
        <CDBSidebarMenuItem
          id="font-txt"
          icon="sticky-note"
          className={activeItem === 'availability' ? 'dash_active' : ''}
          onClick={() => handleItemClick('availability')}
        >
          Availability
        </CDBSidebarMenuItem>
        )}
      </Link>
      <Link to='/users/payments'>
        <CDBSidebarMenuItem
          id="font-txt"
          icon="credit-card"
          iconType="solid"
          className={activeItem === 'payments' ? 'dash_active' : ''}
          onClick={() => handleItemClick('payments')}
        >
          {user?.isTherapist ? 'Income History' : 'Payment History'}
        </CDBSidebarMenuItem>
        </Link>
      <Link to='/therapist/services'>
      {user?.isTherapist && (
        <CDBSidebarMenuItem
          id="font-txt"
          icon="history"
          iconType="solid"
          className={activeItem === 'services' ? 'dash_active' : ''}
          onClick={() => handleItemClick('history')}
        >
          Services
        </CDBSidebarMenuItem>
      )}
      </Link>
        <Link to='/therapist/history'>
      {user?.isTherapist && (
        <CDBSidebarMenuItem
          id="font-txt"
          icon="history"
          iconType="solid"
          className={activeItem === 'history' ? 'dash_active' : ''}
          onClick={() => handleItemClick('history')}
        >
          Appointment History
        </CDBSidebarMenuItem>
      )}
      </Link>
    </CDBSidebarMenu>
      </CDBSidebarContent>
      <CDBSidebarFooter style={{ textAlign: 'center' }}>
        <div className="sidebar-btn-wrapper my_side_bar" style={{ padding: '20px 5px' }}>
          {/* You can add additional elements or text here */}
        </div>
      </CDBSidebarFooter>
    </CDBSidebar>
  );
};

export default Sidebar;
