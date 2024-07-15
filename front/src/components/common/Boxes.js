import React from 'react'

function Boxes() {
  return (
    <div>
      <div>
            <div className="boxes">
                <div className="container">
                    <div className="row">
                        {/* Working Hours Box */}
                        <div className="col-lg-4 box_col">
                            <div className="box working_hours">
                                <div className="box_icon d-flex flex-column align-items-start justify-content-center">
                                    <div style={{ width: '29px', height: '29px' }}>
                                        <img src="images/alarm-clock.svg" alt="" />
                                    </div>
                                </div>
                                <div className="box_title">Chatbot</div>
                                <div className="box_text">
                                Elevate your well-being with our interactive chatbot, providing continuous support and monitoring for your mental health needs.
                                </div>
                            </div>
                        </div>

                        {/* Appointments Box */}
                        <div className="col-lg-4 box_col">
                            <div className="box box_appointments">
                                <div className="box_icon d-flex flex-column align-items-start justify-content-center">
                                    <div style={{ width: '29px', height: '29px' }}>
                                        <img src="images/phone-call.svg" alt="" />
                                    </div>
                                </div>
                                <div className="box_title">Appointments</div>
                                <div className="box_text">
                                Access expert therapists for personalized care, offering both onsite and online appointments tailored to your convenience.
                                </div>
                            </div>
                        </div>

                        {/* Emergency Cases Box */}
                        <div className="col-lg-4 box_col">
                            <div className="box box_emergency">
                                <div className="box_icon d-flex flex-column align-items-start justify-content-center">
                                    <div style={{ width: '37px', height: '37px', marginLeft: '-4px' }}>
                                        <img src="images/bell.svg" alt="" />
                                    </div>
                                </div>
                                <div className="box_title">Mental Well Being Assessment</div>
                                <div className="box_text">
                                Assess your mental well-being with our targeted depression and anxiety tests. Gain valuable insights and take proactive steps towards improved emotional health.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Boxes
