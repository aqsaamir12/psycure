import React from 'react'
import {  useNavigate } from 'react-router-dom'
import Doctor from "../../../assets/images/doctor.png"
import "./PageNotFound.css"
function PageNotFound() {
  const navigate = useNavigate()
  return (
    <div>
          <div>

      {/* Main content */}
      <div className="display_center">
        <div className="main_404_wrapper">
          <div className="left_side_404_page">
            <div className="heading_404">
              <h1>404</h1>
              <p>Oopps! Sorry page does not found</p>
            </div>
            <div className="back_404_btn">
              <button onClick={() => navigate("/")}>Go Back To Home</button>
            </div>
          </div>
          <div className="right_side_404_page">
            <div className="doctor_image">
              <img src={Doctor} alt="doctor" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default PageNotFound
