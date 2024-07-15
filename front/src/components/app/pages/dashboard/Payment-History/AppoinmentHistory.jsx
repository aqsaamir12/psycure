import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from "moment"
import api from '../../../../../config/axios_instance';
import { ENV } from '../../../../../config/config';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';


/**
 * PaymentHistoryTable component to display payment history for therapists.
 * This component fetches payment history data from the server and renders it in a table format.
 *
 * @returns {JSX.Element} PaymentHistoryTable component.
 */
const PaymentHistoryTable = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [therapistAppointments, setTherapistAppointments] = useState();
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Function to fetch therapist appointments from the server.
     * This function sends a GET request to fetch appointment history for the logged-in therapist.
     * Upon successful response, it updates the state with the fetched data.
     * If there's an error, it displays an error toast message.
     */
    const fetchAppointments = async () => {
        try {
            const response = await api.get(`${ENV.appClientUrl}/appointment/history/${user?.id}`);

            if (response?.data?.success) {
                setIsLoading(false);
                setTherapistAppointments(response?.data?.appointments);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error?.response?.data?.message)
        }
    };

    useEffect(() => {
        fetchAppointments()
    }, [])


     /**
     * Function to check if an appointment is upcoming based on its scheduled date and status.
     *
     * @param {string} scheduledDate - The scheduled date of the appointment.
     * @param {number} status - The status of the appointment.
     * @returns {boolean} True if the appointment is upcoming, otherwise false.
     */
    const isAppointmentUpcoming = (scheduledDate, status) => {
        // Get the current date
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
    
        const appointmentDate = new Date(scheduledDate);
    
        if (appointmentDate >= startOfToday && status === 0) {
            return true; 
        } else if (appointmentDate < startOfToday || status === 2) {
            return false;
        } else {
            return false; 
        }
    };


    /**
     * Function to format time from HH:MM format to HH:MM AM/PM format.
     *
     * @param {string} time - The time string in HH:MM format.
     * @returns {string} The formatted time string in HH:MM AM/PM format.
     */
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        let formattedTime = `${parseInt(hours, 10) % 12}:${minutes}`;
        formattedTime += parseInt(hours, 10) >= 12 ? ' PM' : ' AM';
        return formattedTime;
    }

    if (isLoading) {
        return <FullPageLoader />;
    }
    return (
        <div className='dash schedule_wrap'>
            <div className="custom_table mt-0 appointments-section">
                <h2 className="main-title text-left">
                    <span>Appointment</span> History
                </h2>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>User Name</th>
                            <th>Fee</th>
                            <th>Session</th>
                            <th>Location</th>
                            <th>Session ratings</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                    {therapistAppointments?.length ? (
                        therapistAppointments?.map((appointment, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{appointment?.user?.[0]?.fname || appointment?.user?.[0]?.lname ?
                                        `${appointment?.user?.[0]?.fname} ${appointment?.user?.[0]?.lname}` :
                                        "N/A"
                                    }</th>
                                    <td>{formatTime(appointment?.scheduled_time.split(' - ')[0])} - {formatTime(appointment?.scheduled_time.split(' - ')[1])}</td>
                                    <td>{moment.utc(appointment?.scheduled_date).format('MMMM DD, YYYY')}</td>
                                    <td>{appointment?.location ? appointment?.location : "N/A"}</td>
                                    <td>{appointment?.feedback?.length > 0 ? appointment?.feedback?.[0]?.rating : "N/A"}</td>
                                    <td>
                                        {isAppointmentUpcoming(appointment?.scheduled_date, appointment?.status) ? (
                                            <span className='previous_clr'>Upcoming</span>
                                        ) : (
                                            <>
                                                {appointment?.status === 2 ? (
                                                    <span className='canceled'>Cancelled</span>
                                                    ) : (
                                                    <span className='up_coming'>Previous</span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/therapist/appointment/edit/${appointment?._id}`}><div className="therapists_btn "><button type="button">View</button></div></Link>
                                    </td>
                                </tr>
                            )
                        })):<tr>
                        <td colSpan="7">No appointment found.</td>
                    </tr>}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default PaymentHistoryTable;
