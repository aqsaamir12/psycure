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


function UpdateService() {

  const {id} = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const schema = yup.object().shape({
    name: yup.string().required('First Name is required'),
    fee: yup.string().required('Fee is required'),
    location: yup.string().required('Fee is required'),
    zoom: yup.string().required('Zoom link is required'),
    enabled: yup.boolean().required('Status is required'),
    description: yup.string().required('Description is required'),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchService = async () => {
      try {
          const response = await api.get(`${ENV.appClientUrl}/therapistData/get/${id}`);
          if (response?.data?.success) {
            setIsLoading(false);
            setService(response?.data?.service);
              setValue('name', response?.data?.service?.name);
              setValue('fee', response?.data?.service?.fee);
              setValue('zoom', response?.data?.service?.zoom);
              setValue('location', response?.data?.service?.location);
              setValue('description', response?.data?.service?.description);
        setValue('enabled', response?.data?.service?.enabled);

          }
      } catch (error) {
        setIsLoading(false);
          toast.error(error?.response?.data?.message)
      }
  };

  useEffect(() => {
    fetchService()
  }, []);



const serviceSubmit = async (data) => {
try {
  const response = await api.put(`${ENV.appClientUrl}/therapistData/edit/${id}`, data);
if(response?.data?.success) {
    fetchService()
  toast.success(response?.data?.message);
  navigate('/therapist/services')
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
              <h3 className="main-title text-left"><span>Service</span> Edit</h3>
              <Card>
                <Card.Body>

                  <Form onSubmit={handleSubmit(serviceSubmit)}>
                    <Row>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Service Name</label>
                          <Form.Control
                            placeholder="Service Name"

                            type="text"
                            className="customInput"
                            {...register("name")}
                          ></Form.Control>
                           <span className="red-error">{errors.name?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label htmlFor="exampleInputEmail1" className="form-label">
                            Fee
                          </label>
                          <Form.Control
                            placeholder="Enter Fee"

                            type="fee"
                            className="customInput"
                            {...register("fee")}
                          ></Form.Control>
                            <span className="red-error">{errors.fee?.message}</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>

                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Location</label>
                          <Form.Control
                          placeholder="Enter Location"

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
                        <label className="form-label">Status</label>
    <select  className=' customInput form-control' {...register('enabled')}>
      <option value="">Select Status</option>
      <option value={true}>Active</option>
      <option value={false}>Inactive</option>


    </select>
    <span className="red-error">{errors.status?.message}</span>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Description</label>
                          <Form.Control
                            placeholder="Enter Description"
                            type="description"
                            {...register("description")}
                            className="customInput"
                          ></Form.Control>
                          <span className="red-error">{errors.description?.message}</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="therapists_btn text-right">
                          <Button
                            className=" pull-right"
                            type="submit"
                          >
                            Update Service
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

export default UpdateService