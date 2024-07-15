import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Form,
    Container,
    Row,
    Col
} from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../../config/axios_instance';
import { ENV } from '../../../../../config/config';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../Profile/Profile.css';
import FullPageLoader from '../../../../pages/PageNotFound/FullPageLoader';


/**
 * DetailPage component for editing appointment details.
 * This component fetches appointment details based on the provided ID and allows the user to edit them.
 * It includes form validation using Yup schema and submission handling.
 *
 * @returns {JSX.Element} DetailPage component.
 */
function DetailPage() {

  const {id} = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const schema = yup.object().shape({
    fname: yup.string().required('First Name is required'),
    lname: yup.string().required('Last Name is required'),
    fee: yup.string().required('Fee is required'),
    location: yup.string().required('Fee is required'),
    scheduled_date: yup.string().required('Date is required'),
    scheduled_time: yup.string().required('Time is required'),
    zoom: yup.string().required('Zoom link is required'),
    status: yup.number().required('Status is required'),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

   /**
     * Function to fetch appointment details from the server.
     * This function sends a GET request to the server to fetch appointment details based on the provided ID.
     * Upon successful response, it updates the state with the fetched appointment data.
     * If there's an error, it displays an error toast message.
     */
  const fetchAppointments = async () => {
      try {
          const response = await api.get(`${ENV.appClientUrl}/appointment/get/${id}`);

          if (response?.data?.success) {
            setIsLoading(false);
              setAppointment(response?.data?.appointments?.[0]);
              setValue('fname', response?.data?.appointments?.[0]?.user?.[0]?.fname);
              setValue('lname', response?.data?.appointments?.[0]?.user?.[0]?.lname);
              setValue('fee', response?.data?.appointments?.[0]?.fee);
              setValue('zoom', response?.data?.appointments?.[0]?.zoom);
              setValue('location', response?.data?.appointments?.[0]?.location);
              setValue('scheduled_date', response?.data?.appointments?.[0]?.scheduled_date);
              setValue('scheduled_time', response?.data?.appointments?.[0]?.scheduled_time);
    
        const currentDate = new Date();
        const scheduledDate = new Date(response?.data?.appointments?.[0]?.scheduled_date);
        let status = 1;
        if (scheduledDate >= currentDate) {
          status = 0; 
        } else if (response?.data?.appointments?.[0]?.status === 2) {
          status = 2; 
        }
        setValue('status', status);

          }
      } catch (error) {
        setIsLoading(false);
          toast.error(error?.response?.data?.message)
      }
  };

  useEffect(() => {
      fetchAppointments()
  }, []);


     /**
     * Function to handle appointment submission.
     * This function sends a PUT request to update the appointment details based on the provided ID.
     * Upon successful response, it refetches the appointment details and displays a success toast message.
     * If there's an error, it displays an error toast message.
     *
     * @param {Object} data - Form data containing appointment details.
     */
const apppointmentSubmit = async (data) => {
try {
  const response = await api.put(`${ENV.appClientUrl}/appointment/${id}`, data);
if(response?.data?.success) {
  fetchAppointments()
  toast.success(response?.data?.message);
  navigate('/therapist/history')
}
} catch (error) {
  toast.error(error?.response?.data?.message)
}
}

if (isLoading) {
  return <FullPageLoader />;
}
  return (
      <div className="dash">
      <div className="profile-form">
        <Container >
          <Row>
            <Col md="12">
              <h3 className="main-title text-left"><span>Appointment</span> Edit</h3>
              <Card>
                <Card.Body>

                  <Form onSubmit={handleSubmit(apppointmentSubmit)}>
                    <Row>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">First Name</label>
                          <Form.Control
                            placeholder="First Name"
                            disabled
                            type="text"
                            className="customInput"
                            {...register("fname")}
                          ></Form.Control>
                           <span className="red-error">{errors.fname?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Last Name</label>
                          <Form.Control
                            placeholder="Last Name"
                            disabled
                            type="text"
                            className="customInput"
                            {...register("lname")}
                          ></Form.Control>
                          <span className="error">{errors.lname?.message}</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label htmlFor="exampleInputEmail1" className="form-label">
                            Fee
                          </label>
                          <Form.Control
                            placeholder="Enter Fee"
                            disabled
                            type="fee"
                            className="customInput"
                            {...register("fee")}
                          ></Form.Control>
                            <span className="red-error">{errors.fee?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Location</label>
                          <Form.Control
                          placeholder="Enter Location"
                          disabled
                          type='text'
                            className="customInput"
                            {...register("location")}
                          ></Form.Control>
                            <span className="red-error">{errors.location?.message}</span>
                        </Form.Group>
                      </Col>

                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Zoom</label>
                          <Form.Control
                            placeholder="Enter Zoom"
                            type="zoom"
                            {...register("zoom")}
                            className="customInput"
                          ></Form.Control>
                          <span className="red-error">{errors.zoom?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Scheduled Date</label>
                          <Form.Control
                            placeholder="Select Date"
                            disabled
                            type="date"
                            value={appointment ? appointment.scheduled_date.slice(0, 10) : ""}
                            {...register("scheduled_date")}
                            className="customInput"
                          ></Form.Control>
                          <span className="red-error">{errors.scheduled_date?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Scheduled Time</label>
                          <Form.Control
                            placeholder="Select Time"
                            disabled
                            type="text"
                            {...register("scheduled_time")}
                            className="customInput"
                          ></Form.Control>
                            <span className="red-error">{errors.scheduled_time?.message}</span>
                        </Form.Group>
                      </Col>
                    
                      <Col md="6">
                        <Form.Group className="form-group">
                        <label className="form-label">Status</label>
    <select  className=' customInput form-control' {...register('status')}>
      <option value="">Select Status</option>
      <option value={0}>Accept</option>
      <option value={1}>Previous</option>
      <option value={2}>Cancelled</option>
   
    </select>
    <span className="red-error">{errors.status?.message}</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="therapists_btn text-right">
                          <Button
                            className=" pull-right"
                            type="submit" 
                            disabled={appointment?.status === 1}
                          >
                            Update Appointment
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <div className="clearfix"></div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default DetailPage
