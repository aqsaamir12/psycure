import React from 'react'
import aboutImage from '../../assets/images/about_2.jpg';
import { Link } from 'react-router-dom';

function AboutUs() {
  const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
  };
  return (
    <div>
      <div className="about">
            <div className="container">
                <div className="row row-lg-eq-height">
                    {/* About Content */}
                    <div className="col-lg-7">
                        <div className="about_content">
                            <div className="section_title"><h2>An incredible team of expert therapists</h2></div>
                            <div className="about_text">
                                <p>
                                Welcome to PsyCube, where your mental well-being is our top priority. Our platform boasts an exceptional team of expert therapists dedicated to guiding you on your journey to emotional wellness. Whether you prefer remote sessions or in-person appointments, we offer flexible options to suit your needs. With PsyCube, you have the freedom to book appointments with your preferred therapist, ensuring a personalized experience tailored to your unique requirements.
                                </p>
                            </div>
                            <Link to="/aboutus" className="custom_btn mt-5" onClick={scrollToTop}>
                              <span style={{ display: 'inline-block', marginTop: '10px', verticalAlign: 'middle' }}>Read More</span>
                            </Link>
                            </div>
                    </div>

                    {/* About Image */}
                    <div className="col-lg-5">
                        <div className="about_image"><img src={aboutImage} alt="" style={{ height: '400px', width: '350px'}}/></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AboutUs
