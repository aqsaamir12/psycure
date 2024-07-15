import React, { useEffect, useState } from 'react';
import './Schedule.css';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../../config/axios_instance';
import moment from "moment";
import { ENV } from '../../../../../config/config';
import { toast } from 'react-toastify';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';


/**
 * CurrentAppointments component to display current appointments and payment history for users.
 * This component fetches user payment history data from the server and renders it in a table format.
 *
 * @returns {JSX.Element} CurrentAppointments component.
 */
const CurrentAppointments = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userAppointments, setUserAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserAppointments();
  }, []);


   /**
   * Function to fetch user appointments from the server.
   * This function sends a GET request to fetch payment history for the logged-in user.
   * Upon successful response, it updates the state with the fetched data.
   * If there's an error, it logs the error and displays an error toast message.
   */
  const fetchUserAppointments = async () => {
    try {
      const response = await api.get(`${ENV.appClientUrl}/payment/${user?.id}`);
      if (response?.data?.success) {
        setIsLoading(false);
        setUserAppointments(response?.data?.payments.filter(appointment => appointment?.paid === true));
      }else{
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <div className="dash">
      <div className="custom_table mt-0">
        <h2 className='main-title text-left'><span>{user?.isTherapist ? 'Income' : 'Payment'}</span> History</h2>
        <div className='table-responsive over-x-hiden'>
        <table className="table table-striped ">
          <thead className='thead-dark'>
            <tr>
            <th>User Name</th>
              <th>Therapist Name</th>
              <th>Date</th>
              <th>Amount Paid</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {userAppointments?.length ? (
            userAppointments?.map((appointment, index) => (
              <tr key={index}>
                 <td>{appointment?.user?.fname} {appointment?.user?.lname}</td>
                <td>{appointment?.therapist?.fname} {appointment?.therapist?.lname}</td>
                <td>{moment.utc(appointment?.scheduled_date).format('MMMM DD, YYYY')}</td>
                <td>{appointment?.fee}</td>
                <td> {appointment?.paid ? '✔️' : '❌'}</td>
              </tr>
             ))
             ) : (
               <tr>
                 <td colSpan="5">No {user?.isTherapist ? 'income' : 'payment'} found.</td>
               </tr>
             )}
          </tbody>
        </table>
        </div>
      
      </div>
    </div>
  );
};

export default CurrentAppointments;
