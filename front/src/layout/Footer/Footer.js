import React from 'react';
import { FaPinterest, FaFacebook, FaTwitter, FaDribbble, FaBehance, FaLinkedin } from 'react-icons/fa';
import PhoneCall from "../../assets/images/phone-call.svg"
import Envelope from "../../assets/images/envelope.svg"
import PlaceHolder from "../../assets/images/placeholder.svg"
import { Link } from 'react-router-dom';
import Psy from "../../assets/images/cure-logo2.png"


function Footer() {
    return (
        <footer className="footer">
            <div className="footer_container">
                <div className="container">
                    <div className="row">
                        {/* Footer - About */}
                        <div className="col-lg-4 footer_col">
                            <div className="footer_about">
                                <div className="footer_logo_container">
                                    <Link to="/" className="d-flex flex-column align-items-center justify-content-center">
                                        <div className="logo_content">
                                            <div className="logo logo_text d-flex flex-row align-items-center justify-content-center">
                                            <img src={Psy} alt='logo'/>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="footer_about_text">
  <p style={{ marginTop: '70px', marginRight: '20px' }}>
    PsyCube offers personalized mental health support from expert therapists, flexible appointments, and innovative features like an interactive chatbot. Take control of your emotional well-being with us.
  </p>
</div>

                            </div>
                        </div>

                        {/* Footer - Links */}
                        <div className="col-lg-4 footer_col">
                            <div className="footer_links footer_column">
                                <ul>
                                    <li><Link to="/aboutus">About us</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/signup">Sign Up</Link></li>
                                    <li><Link to="/contactus">Contact</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer - News */}
                        <div className="col-lg-4 footer_col">
                            <div className="footer_news footer_column">
                                <ul className="footer_about_list">
                                    <li><div className="footer_about_icon"><img src={PhoneCall} alt="PhoneCall" /></div><span>+92 323 2282455</span></li>
                                    <li><div className="footer_about_icon"><img src={Envelope} alt="envelope" /></div><span>contactus@psycube.com</span></li>
                                    <li><div className="footer_about_icon"><img src={PlaceHolder} alt="PlaceHolder" /></div><span>7 Malik Manazer St, Ali Park Ali Park Lahore Cantt, Lahore, Punjab 54000</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="copyright_content d-flex flex-lg-row flex-column align-items-lg-center justify-content-start">
                                <div className="cr text-center">
                                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                    Copyright &copy;<script>
                                        document.write(new Date().getFullYear());
                                    </script> All right Reserved@PSYCUBE 
                                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                </div>
                                <div className="footer_social ml-lg-auto">
                                    <ul>
                                        <li><Link to="#"><FaPinterest /></Link></li>
                                        <li><Link to="#"><FaFacebook /></Link></li>
                                        <li><Link to="#"><FaTwitter /></Link></li>
                                        <li><Link to="#"><FaDribbble /></Link></li>
                                        <li><Link to="#"><FaBehance /></Link></li>
                                        <li><Link to="#"><FaLinkedin /></Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
