import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import myLogo from '../../assets/img/cure-logo2.png';
import { Link } from 'react-router-dom';

const Header = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isSmallScreen = screenWidth <= 991;

  return (
    <Navbar collapseOnSelect expand="lg" className="mynav">
      <div className="dasborad-nav">
      <Link to={`/`}><Navbar.Brand href="#home" className="logo-img"><img src={myLogo} alt="black"></img></Navbar.Brand></Link>
      <Link><img src={menuIcon} alt="menuIcon" className="menuIcon" /></Link>
      
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="nav_dropdown_design align-items-center">
            <NavDropdown title={userProfile.fname} id="basic-nav-dropdown"  className="nav-text" >
              <Link to={`/users/editprofile`}><NavDropdown.Item href="#action/3.1" className="nav-droptext"><img src={profileImage} alt=""/> Profile</NavDropdown.Item></Link>
              <Link to={`/`}><NavDropdown.Item href="#action/3.2" className="logout_nav nav-droptext">
                 <img src={logOut} alt=""/> Logout
              </NavDropdown.Item></Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
