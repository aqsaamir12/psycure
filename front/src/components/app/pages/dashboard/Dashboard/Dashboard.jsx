import React from "react";
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faMoneyBill, faPhone, faXmark } from '@fortawesome/free-solid-svg-icons';
 
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import { Link } from "react-router-dom";
import FullPageLoader from "../../../../pages/PageNotFound/FullPageLoader";

/**
 * Dashboard component to display user statistics and navigation links.
 * This component displays statistics such as completed appointments, total money spent,
 * upcoming appointments, and cancelled appointments. It also provides links for users
 * to navigate to different sections of the application.
 *
 * @returns {JSX.Element} Dashboard component.
 */

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [dashboard, setDashboard] = useState();
  const [isLoading, setIsLoading] = useState(true)

   /**
   * Function to fetch dashboard data from the server.
   * This function sends a GET request to the server to fetch user dashboard data.
   * Upon successful response, it updates the state with the fetched data.
   * If there's an error, it displays an error toast message.
   */
  async function FetchData() {
    try {
        const response = await api.get(`${ENV.appClientUrl}/dashboard/${user?.id}`);
        if (response?.data?.success) {
          setIsLoading(false);
            setDashboard(response?.data?.dashboardData);
     
        } else {
          setIsLoading(false);
            toast.error(response?.data?.message);
     
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
 
    }
}

useEffect(() => {
    FetchData();
}, []);


 // If data is loading, display a full page loader component
if (isLoading) {
  return <FullPageLoader />;
}
  return (
    <div className="dash">
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats radius">
              <Link to="/users/schedule">
              <Card.Body>
                <div className="numbers">
                  <div className="calander">
                    <div className="icon_wrap">
                     <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>
                  <div className="wrap_info">
                    <p className="card-category ml-2">Appointments Completed</p>
                    <Card.Title as="h4">{dashboard?.appointmentPrevious || 0}</Card.Title>
                  </div>
                  </div>
                </div>
              </Card.Body>
             </Link>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats radius">
            <Link to="/users/schedule">
              <Card.Body>
                <div className="numbers">
                  <div className="calander">
                    <div className="icon_wrap">
                     <FontAwesomeIcon icon={faPhone} />
                    </div>
                  <div className="wrap_info">
                    <p className="card-category ml-2">Upcoming Appointments</p>
                    <Card.Title as="h4">{dashboard?.appointmentUpcoming || 0}</Card.Title>
                  </div>
                  </div>
                </div>
              </Card.Body>
              </Link>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats radius">
            <Link to="/users/schedule">
              <Card.Body>
                <div className="numbers">
                  <div className="calander">
                    <div className="icon_wrap">
                     <FontAwesomeIcon icon={faXmark} />
                    </div>
                  <div className="wrap_info">
                    <p className="card-category ml-2">Appointments Cancelled</p>
                    <Card.Title as="h4">{dashboard?.appointmentCancelled || 0}</Card.Title>
                  </div>
                  </div>
                </div>
              </Card.Body>
              </Link>
            </Card>
          </Col>
          <Col lg="3" sm="6">
          <Card className="card-stats radius">
          <Link to="/users/payments">
              <Card.Body>
                <div className="numbers">
                  <div className="calander">
                    <div className="icon_wrap">
                    <FontAwesomeIcon icon={faMoneyBill} /> 
                    </div>
                  <div className="wrap_info">
                    <p className="card-category ml-2">Total Money Spent</p>
                    <Card.Title as="h4">Rs. {dashboard?.totalPayment?.[0]?.totalPayment || 0 }</Card.Title>
                  </div>
                  </div>
                </div>
              </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;