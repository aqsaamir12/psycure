import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you might need useNavigate
import { toast } from 'react-toastify';
import api from '../../../config/axios_instance';
import { ENV } from '../../../config/config';
import FullPageLoader from '../PageNotFound/FullPageLoader';

// React Bootstrap Components
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';

// CSS import if it's separate
import "./Services.css";

function Services() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // If you need to navigate after form submission

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    fee: yup.number().transform(value => isNaN(value) ? undefined : value).default(0).min(1000, 'Fee must be at least 1000').required('Fee is required'),
    zoom: yup.string().required('Zoom link is required'),
    description: yup.string().required('Description is required'),
    status: yup.boolean().required('Status is required'),
    location: yup.string().required('Location is required'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(`${ENV.appClientUrl}/therapistData/create/?therapistId=${user?.id}`, data);
      if (response?.data?.success) {
        toast.success(response?.data.message);
        reset();
        navigate('/therapist/services');
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="dash">
      <div className="profile-form">
        <Container>
          <Row>
            <Col md="12">
              <h3 className="main-title text-left"><span>Service</span> Creation</h3>
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Row>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <Form.Label>Service Name</Form.Label>
                          <Form.Control type="text" placeholder="Name" {...register('name')} />
                          <p className="text-danger">{errors.name?.message}</p>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <Form.Label>Fee</Form.Label>
                          <Form.Control type="number" placeholder="Enter Fee" {...register('fee')} />
                          <p className="text-danger">{errors.fee?.message}</p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Form.Group className="form-group">
                          <Form.Label>Zoom Link</Form.Label>
                          <Form.Control type="text" placeholder="Enter zoom link" {...register('zoom')} />
                          <p className="text-danger">{errors.zoom?.message}</p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <Form.Label>Status</Form.Label>
                          <Form.Control as="select"className="custom-select" {...register('status')}>
                            <option value="">Select Status</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </Form.Control>
                          <p className="text-danger">{errors.status?.message}</p>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group className="form-group">
                          <Form.Label>Location</Form.Label>
                          <Form.Control as="select" className="custom-select" {...register('location')}>
                            <option value="">Location</option>
                            <option value="Remote">Remote</option>
                            <option value="On-site">On-site</option>
                          </Form.Control>
                          <p className="text-danger">{errors.location?.message}</p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Form.Group className="form-group">
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Description" {...register('description')} />
                          <p className="text-danger">{errors.description?.message}</p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="mt-4">
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Services;
