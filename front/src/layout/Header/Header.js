import React, { useEffect, useState } from 'react'
import PSYCUBE from "../../assets/images/cure-logo2.png"
import ProfileIcon from "../../assets/images/profleicon.png"
import { Link } from 'react-router-dom'

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
    const [scrolled, setScrolled] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 100) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
  return (
    <>
    <header className="header trans_200">
    <div className={scrolled ? 'header scrolled' : 'header'}>
    <div className="top_bar">
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="top_bar_content d-flex flex-row align-items-center justify-content-start">
                        {/* <div className="top_bar_item"><a href="#">FAQ</a></div> */}
                        {!user?.isTherapist ?<div className="top_bar_item"><a href="/users/book-appointments">Request an Appointment</a></div>: ""}
                        <div className="emergencies d-flex flex-row align-items-center justify-content-start ml-auto">For Emergencies: +92 323 2282455</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="header_container">
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="header_content d-flex flex-row align-items-center justify-content-start">
                        <nav className="main_nav ml-auto">
                            <ul className='d-flex align-items-center'>
                                <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
                                <li><Link to="/aboutus" onClick={scrollToTop}>About us</Link></li>
                             
                                <li><Link to="/login" onClick={scrollToTop}>Login</Link></li>
                                <li><Link to="/signup" onClick={scrollToTop}>SignUp</Link></li>
                                {user?.id ? <li><Link to={user?.isTherapist ? '/therapist/editprofile' : '/users/editprofile'} onClick={scrollToTop}>
                                  <img src={ProfileIcon} alt='profile' className='profli_icon'/>
                                  </Link></li> : ""}

                                <li><Link to="/contactus" onClick={scrollToTop}>Contact</Link></li>
                            </ul>
                        </nav>
                        <div className="hamburger ml-auto"><i className="fa fa-bars" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="logo_container_outer">
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="logo_container">
                        <a href="#">
                            <div className="logo_content d-flex flex-column align-items-start justify-content-center">
                                <div className="logo_line"></div>
                                <div className="logo d-flex flex-row align-items-center justify-content-center">
                                    <div className="logo_text">
                                        <img src={PSYCUBE} alt='logo'/>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</header>
 

    <div className="menu_container menu_mm">

    <div className="menu_close_container">
      <div className="menu_close"></div>
    </div>

          <div className="menu_inner menu_mm">
            <div className="menu menu_mm">
              <ul className="menu_list menu_mm">
                <li className="menu_item menu_mm"><a href="index.html">Home</a></li>
                <li className="menu_item menu_mm"><a href="about.html">About us</a></li>
                <li className="menu_item menu_mm"><a href="services.html">Services</a></li>
                <li className="menu_item menu_mm"><a href="news.html">News</a></li>
                <li className="menu_item menu_mm"><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div className="menu_extra">
              <div className="menu_appointment"><a href="#">Request an Appointment</a></div>
              <div className="menu_emergencies">For Emergencies: +92 323 2282455</div>
            </div>

          </div>

          </div>
          </>
  )
}

export default Header
