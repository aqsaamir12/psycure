import React, { useEffect, useState } from 'react';
import './Schedule.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import api from '../../../../../config/axios_instance';
import moment from 'moment';
import { ENV } from '../../../../../config/config';
import { useNavigate } from 'react-router-dom';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';


/**
 * CurrentAppointments component to display current appointments for users.
 * This component fetches user appointments data from the server and renders it in a table format.
 *
 * @returns {JSX.Element} CurrentAppointments component.
 */
const CurrentAppointments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userAppointments, setUserAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
        try {
            const response = await api.get(`${ENV.appClientUrl}/appointment/${user?.id}`);

            if (response?.data?.success) {
              setIsLoading(false);
              setUserAppointments(response?.data?.appointments);
            }
        } catch (error) {
          setIsLoading(false);
            toast.error(error?.response?.data?.message)
        }
    };

    fetchAppointments();
}, []);

/**
 * Function to format time from HH:MM format to HH:MM AM/PM format.
 *
 * @param {string} time - The time in HH:MM format.
 * @returns {string} Formatted time in HH:MM AM/PM format.
 */
function formatTime(time) {
  const [hours, minutes] = time.split(':');
  let formattedTime = `${parseInt(hours, 10) % 12}:${minutes}`;
  formattedTime += parseInt(hours, 10) >= 12 ? ' PM' : ' AM';
  return formattedTime;
}
const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);



    /**
 * Function to render appointments section.
 *
 * @param {number} status - The status of appointments (0 for upcoming, 1 for previous, 2 for cancelled).
 * @param {string} heading - The heading for the section.
 * @returns {JSX.Element} Appointments section.
 */
  const renderAppointmentsSection = (status, heading) => {
    const filteredAppointments = userAppointments?.filter(
        (appointment) => appointment?.status === status
    );
    const firstWord = heading.split(' ')[0];  
    const restOfHeading = heading.slice(firstWord?.length);
    const currentDate = startOfToday;
    return ( 
 
      <div className="custom_table appointments-section" key={status}>
        <h2 className='main-title text-left'> <span>{firstWord}</span>{restOfHeading}</h2>
        <table className="table table-striped">
          <thead className='thead-dark'>
            <tr>
              <th>Id</th>
              <th>Time</th>
              <th>Date</th>
              <th>Therapist Name</th>
              <th>Consultation Reason</th>
              <th>Paid</th>
              <th>Review</th>
              <th>Virtual Session</th>
            </tr>
          </thead>
          <tbody>
          {filteredAppointments?.length > 0 ? (
            filteredAppointments?.map((appointment, index) => (
              <tr key={index}>
                <th scope="row">1</th>
                <td>{formatTime(appointment?.scheduled_time.split(' - ')[0])} - {formatTime(appointment?.scheduled_time.split(' - ')[1])}</td>
                <td>{moment.utc(appointment?.scheduled_date).format('MMMM DD, YYYY')}</td>
                <td>{appointment?.therapist ? `${appointment?.therapist?.[0]?.fname} ${appointment?.therapist?.[0]?.lname}` : "N/A"}</td>
                <td>{appointment?.reason}</td>
                <td> {appointment?.paid ? '✔️' : '❌'}</td>
                <td>
                  <div className="therapists_btn ">
                  {(appointment?.feedback?.length === 0 && new Date(appointment?.scheduled_date) <= currentDate) ? (
                      <button type="button" onClick={() => navigate(`/users/rating/${user?.id}/${appointment?._id}`)}>Review</button>
                    ) : (
                      <button type="button" disabled>Review</button>
                    )}
                  </div>
                </td>
                <td>
                  <div className="therapists_btn ">
                    <button type="button" onClick={() => handleJoinGoogleMeet(appointment?.zoom)} disabled={new Date(appointment?.scheduled_date) < currentDate}
                    >Join</button>
                  </div>
                </td>
              </tr>
            ))
           ) : (
            <tr>
              <td colSpan="8">No {firstWord.toLowerCase()} appointments found.</td>
            </tr>
          )} 
        </tbody>
        </table>
      </div> 
    );
  };

   /**
   * Function to handle joining Google Meet session.
   *
   * @param {string} zoom - The Zoom link for the session.
   */
  const handleJoinGoogleMeet = (zoom) => {
    window.open(zoom, '_blank');
  };

  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <div className="dash schedule_wrap">
       {renderAppointmentsSection(0, 'Upcoming Appointments')}
      {renderAppointmentsSection(1, 'Previous Appointments' )}
      {renderAppointmentsSection(2, 'Cancelled Appointments')}
    </div>
  );
};

export default CurrentAppointments;
