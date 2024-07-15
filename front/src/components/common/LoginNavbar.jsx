import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import myLogo from '../../assets/images/cure-logo2.png';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

export const LoginNavbar = () =>  {
  const [userProfile, setUserProfile] = useState();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); 
    setUserProfile(user);
  },[]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="mynav">
      <Container>
      <Link to={`/`}><Navbar.Brand href="#home" className="logo-img"><img src={myLogo} alt="black"></img></Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <NavDropdown title={userProfile?.fname} id="basic-nav-dropdown" className="nav-text" >
              <NavDropdown.Item  className="nav-droptext">  {userProfile?.certification ? (
        <Link to="/therapist/editprofile">Profile</Link>
      ) : (
        <Link to="/users/editprofile">Profile</Link>
      )}</NavDropdown.Item>

              <Link to={`/`} onClick={handleLogout}><NavDropdown.Item href="/" className="nav-droptext">
                  Logout
              </NavDropdown.Item></Link>

            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );    
}
export default LoginNavbar;

