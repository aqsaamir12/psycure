import React, { useState, useEffect } from 'react'
import ContactIMg from "../../../../../assets/images/contact.jpg"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {  Modal } from 'react-bootstrap';
import moment from 'moment'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import CheckoutForm from './CheckoutForm';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';

// Load Stripe
const stripePromise = loadStripe("pk_test_51OvR7XP40BAZPmSYGkwDNfdqdcVy2645QEc52QsEulYszXdHdms6ENmfZR7Tm3XeHr0bLtF9Vi75gkFfaUHVo8C300Vu3WpAiO");


 /**
   * Component for confirming appointments.
   * 
   * @returns {JSX.Element} ConfirmAppoinment component.
   */
function ConfirmAppoinment() {

    const navigate = useNavigate()
    const { therapistId, serviceId } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const [clientSecret, setClientSecret] = useState("");
    const [show, setShow] = useState(false);
    const [availability, setAvailability] = useState();
    const [day, setDay] = useState()
    const currentDate = new Date().toISOString().split('T')[0];
    const [selectedSlot, setSelectedSlot] = useState('');
    const [serviceDetails, setServiceDetails] = useState();
    const [status, setStatus]= useState(false);
    const [formData, setFormData]= useState();
    const [therapistAppointments, setTherapistAppointments] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        zoom: yup.string().required('Zoom link is required'),
        fee: yup.number().required('Fee is required').positive('Fee must be a positive number'),
        scheduled_date: yup.date().min(currentDate).required('Date is required'),
        reason: yup.string().required('Reason for appoinment is required'),
        location: yup.string().required('Location is required'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    // Function to fetch payment details from the server
const fetchPayment = async(appointmentData)=>{
    setIsLoading(true);
    const response = await api.post(`${ENV.appClientUrl}/appointment/create-payment-intent`, {appointmentData})
    if(response?.data?.success){
        setClientSecret(response?.data?.clientSecret)
        setIsLoading(false);
    }
}


  // Function to confirm appointment after payment
const confirmAppointment = async()=>{
    formData.paid = status
    const response = await api.post(`${ENV.appClientUrl}/appointment`,formData );
        if(response?.data?.success){
            toast.success(response?.data?.message);
            reset();
            navigate("/users/dashboard");
        }else{
            toast.error(response?.data?.message);
        }
}

   // Options for appearance in Stripe elements
    const appearance = {
      theme: 'stripe',
    };
    const options = {
      clientSecret,
      appearance,
    };

    // Function to fetch therapist appointments from the server
    const fetchAppointments = async () => {
        try {
            const response = await api.get(`${ENV.appClientUrl}/appointment/therapist/${therapistId}`);

            if (response?.data?.success) {
                setTherapistAppointments(response?.data?.appointments);
            }
        } catch (error) {
            console.error(error)
        }
    };

     // Effect hook to fetch data when component mounts or dependencies change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`${ENV.appClientUrl}/therapistData/${therapistId}/${serviceId}`);
                if (response.data?.success) {
                    setServiceDetails(response?.data?.service);
                    setValue("fee", response?.data?.service?.fee);
                    setValue("zoom", response?.data?.service?.zoom);
                    setValue("location", response?.data?.service?.location)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message)
            }
        };

        fetchData();
        fetchAppointments();
    }, [therapistId, serviceId]);

    // Function to handle date change event
    const handleDateChange = (event) => {
        const date = new Date(event);
        const options = { weekday: 'long' };
        const dayName = date.toLocaleDateString('en-US', options);
        setDay(dayName)
        const dateSelect = moment(event).format('YYYY-MM-DD');
        setValue("scheduled_date", dateSelect)
        async function FetchData() {
            await api.get(`${ENV.appClientUrl}/availability/day?day=${dayName}&date=${dateSelect}&therapistId=${therapistId}`).then((result) => {
                setAvailability(result?.data?.dayAvailability);
            }).catch((err) => {
                setAvailability([]);
                toast.error(err?.response?.data?.message)
            });
        }
        FetchData()
    }

    // Function to handle slot selection
    const handleSelectSlot = (event) => {
        const selectedSlot = event.target.value;
        setSelectedSlot(selectedSlot);
    };

    // Function to check if slot is available
    const isSlotAvailable = (slot) => {
        if (!therapistAppointments) return true;
        const selectedDate = moment(day, 'dddd').format('YYYY-MM-DD');
        const startTime = slot.split(' - ')[0];
        const endTime = slot.split(' - ')[1];
    
        // Check if the selected slot overlaps with any existing appointments
        for (const appointment of therapistAppointments) {
            if (
                moment(appointment?.scheduled_date).format('YYYY-MM-DD') === selectedDate &&
                appointment?.scheduled_time === slot
            ) {
                return false; // Slot is not available if it overlaps with an existing appointment
            }
        }
        return true; // Slot is available if it doesn't overlap with any existing appointment
    };

    // Effect hook to handle status change for confirming appointment
    useEffect(() => {
        if (status) {
            confirmAppointment();
        }
    }, [status]);


    /**
   * Handles form submission for processing payment.
   *
   * @param {Object} data - The data submitted via the form.
   */
    const handleAppoinmentForm = async (data) => {
        try {
            data.therapist = therapistId;
            data.service = serviceId;
            data.user = user?.id;
            data.paid = status;
            data.scheduled_time= selectedSlot;
            if(!status){
                handleShow()

               await fetchPayment(data)
            }
          
            setFormData(data);
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
        
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

        // Function to format time
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        let formattedTime = `${parseInt(hours, 10) % 12}:${minutes}`;
        formattedTime += parseInt(hours, 10) >= 12 ? ' PM' : ' AM';
        return formattedTime;
    }

     // Return loading screen if data is loading
    if (isLoading) {
        return <FullPageLoader />;
    }
    return (
        <div>
            <div>
                <div className='contact__wrap confirm_appoinment '>
                    <div className="home ">
                        <div className="home_background parallax-window"   >
                            <img src={ContactIMg} />
                        </div>
                        <div className="home_container">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <div className="home_content">
                                            <div className="home_title"><span>PSYCUBE</span></div>
                                            <div className="breadcrumbs">
                                                <ul>
                                                    <li><Link to="/">Home</Link></li>
                                                    <li>Appointment</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
                <div className='bg_service '>
                    <div className="col-md-6">
                        <div className="contact-wrap w-100 p-lg-5 p-4">
                            <h3 className="mb-4">Appointment</h3>
                            <div id="form-message-warning" className="mb-4"></div>
                            <form onSubmit={handleSubmit(handleAppoinmentForm)} id="contactForm" name="contactForm" className="contactForm" novalidate="novalidate">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="name" id="name"  {...register("name")} placeholder="Name" />
                                            {errors.name && <span className="text-danger">{errors.name.message}</span>}

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="number" className="form-control" readOnly={true} name="fee" id="fee" {...register("fee")} placeholder="Enter Fee" />
                                            {errors.fee && <span className="text-danger">{errors.fee.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="zoom" id="zoom" readOnly={true} {...register("zoom")} placeholder="Enter zoom link" />
                                            {errors.zoom && <span className="text-danger">{errors.zoom.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="date" onChange={(event) => handleDateChange(event.target.value)} 
                                            className="form-control" 
                                            name="days" id="daysdasddasd" placeholder="Day" />
                                            {errors.scheduled_date && <span className="text-danger">{errors.scheduled_date.message}</span>}
                                        </div>
                                    </div>
                                

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <select disabled className='form-control' {...register('location')}>
                                                <option value="">location</option>
                                                <option value="Remote">Remote</option>
                                                <option value="On-site">On-site</option>
                                            </select>
                                            {errors.location && <span className="text-danger">{errors.location.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <select className='form-control' onChange={handleSelectSlot}>
                                                <option>Select Interval</option>
                                                {availability?.map((dayData) => (
                                                    
                                                        <option key={dayData?._id} 
                                                        value={`${dayData?.startTime} - ${dayData?.endTime}`}
                                                        disabled={!isSlotAvailable(`${dayData?.startTime} - ${dayData?.endTime}`)}
                                                        className={!isSlotAvailable(`${dayData?.startTime} - ${dayData?.endTime}`) ? 'disabled-option' : ''}
                                                        >
                                                            {`${formatTime(dayData?.startTime)} - ${formatTime(dayData?.endTime)}`}
                                                        </option>
                                                    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <textarea type="text" className="form-control" name="description" id="description" {...register("reason")} placeholder="Reason for Consulation" />
                                            {errors.reason && <span className="text-danger">{errors.reason.message}</span>}
                                        </div>
                                    </div>
                                        <div className="form-group text-end">
                                            <button type='submit'className='custom_btn ' ><span>confirm</span></button>
                                            {/* <div className="button home_button" onClick={handleShow}><Link  >Confirm</Link></div> */}
                                        </div>
                                    </div>
                            </form>
                        </div>
                    </div>
                    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
                     <Modal show={show} onHide={handleClose}>
                        <CheckoutForm setStatus={setStatus}/>
                  

                    </Modal> 
                    </Elements>
      )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmAppoinment
