import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from "moment"
import api from '../../../../../config/axios_instance';
import { ENV } from '../../../../../config/config';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';


/**
 * ServicesHistoryTable component to display payment history for therapists.
 * This component fetches payment history data from the server and renders it in a table format.
 *
 * @returns {JSX.Element} ServicesHistoryTable component.
 */
const ServicesHistoryTable = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [therapistServices, setTherapistServices] = useState();
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Function to fetch therapist services from the server.
     * This function sends a GET request to fetch service history for the logged-in therapist.
     * Upon successful response, it updates the state with the fetched data.
     * If there's an error, it displays an error toast message.
     */
    const fetchServices = async () => {
        try {
            const response = await api.get(`${ENV.appClientUrl}/therapistData/${user?.id}`);
            if (response?.data?.success) {
                setIsLoading(false);
                setTherapistServices(response?.data?.services);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error?.response?.data?.message)
        }
    };

    useEffect(() => {
        fetchServices()
    }, [])

const handleDelete = async (id) => {
  try {
    const response = await api.delete(`${ENV.appClientUrl}/therapistData/${id}`);
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      fetchServices();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
}

    if (isLoading) {
        return <FullPageLoader />;
    }
    return (
<div className='dash schedule_wrap'>
    <div className="custom_table mt-0 appointments-section">
        <div className="header-flex-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="main-title text-left">
                <span>Services</span> History
            </h2>
            <div className="therapists_btn">
                <Link to="/therapist/addservice">
                    <button>Create Service</button>
                </Link>
            </div>
        </div>
        <table className="table table-striped" style={{ clear: 'both' }}>
            <thead className="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Fee</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {therapistServices?.length ? (
                therapistServices?.map((service, index) => {
                    return (
                        <tr key={index}>
                            <td>{service?.name ? service?.name : "N/A"}</td>
                            <td>{service?.fee ? service?.fee : "N/A"}</td>
                            <td>{service?.location ? service?.location : "N/A"}</td>
                            <td>
                                {service?.enabled ? (
                                    <span className='previous_clr'>Active</span>
                                    ) : (
                                        <span className='canceled'>Inactive</span>
                                )}
                            </td>
                            <td>{moment.utc(service?.createdAt).format('MMMM DD, YYYY')}</td>
                            <td className='action_wraper flex'>
                                <Link to={`/therapist/edit/${service?._id}`}><div className="therapists_btn"><button type="button">Edit</button></div></Link>
                                <button type="button" onClick={() => handleDelete(service?._id)}>Delete</button>
                            </td>
                        </tr>
                    )
                })) : <tr>
                <td colSpan="6">No service found.</td>
            </tr>}
            </tbody>
        </table>
    </div>
</div>

    );
};

export default ServicesHistoryTable;