import React from 'react';
import ctaBackground from '../../assets/images/cta.jpg';

function CTA() {
    return (
        <div className="cta">
            <div className="cta_background parallax-window"></div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="cta_content text-center">
                            <h2>Get started with your mental well being journey NOW!</h2>
                            <div className="top_bar_item">
                                <a href="/users/editprofile" className="custom_btn mt-5"><span style={{ display: 'inline-block', marginTop: '10px', verticalAlign: 'middle' }}>Take Assessment</span></a>
                            </div>
                            {/* <button  className="custom_btn mt-5"><span>Take Assessment</span></button> */}
                        </div>
                    </div>
                </div>
            </div>		
        </div>
    );
}

export default CTA;
