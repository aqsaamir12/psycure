/**
 * Functional component for the Contact page.
 *
 * This component displays a contact form and contact information.
 * Users can fill out the form to send a message.
 *
 * @component
 * @returns {JSX.Element} Contact component
 */

import React from 'react';
import "./ContactUs.css"
import { toast } from 'react-toastify';
import ContactIMg from "../../../assets/images/contact.jpg"
import PhoneCall from "../../../assets/images/phone-call.svg"
import Envelope from "../../../assets/images/envelope.svg"
import Placeholder from "../../../assets/images/placeholder.svg"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../config/axios_instance';
import { ENV } from '../../../config/config';
import { Link } from 'react-router-dom';

const Contact = () => {

  /**
   * Form validation schema using yup.
   */
  const schema = yup.object().shape({
    name: yup.string().required('Name is Required'),
    email: yup
      .string()
      .required('Email is Required')
      .email('Invalid Email Format. Please enter a valid email in the following format: raza@gmail.com'),
    subject: yup.string().required('Subject is Required'),
    message: yup.string().required('Message is Required'),
  });


  /**
   * React Hook Form setup and form state management.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });


  /**
  * Handles form submission.
  * Sends form data to the server and resets the form on success.
  *
  * @param {object} data - Form data
  */
  const handleFormSubmit = async (data) => {
    try {
      const response = await api.post(`${ENV.appClientUrl}/contact`, data)
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        reset();
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)

    }
  };


  return (
    <div className='contact__wrap'>
      <div className="home">
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
                      <li>Contact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section_title text-start"><h2 className='text-start'>Get in touch</h2></div>
              <div className="contact_text">
                <p>
                Your feedback matters! Let us know how we can improve our platform to better serve you.
                  </p>
              </div>
              <ul className="contact_about_list">
                <li><div className="contact_about_icon"><img src={PhoneCall} alt="" /></div><span>+92 323 2282455</span></li>
                <li><div className="contact_about_icon"><img src={Envelope} alt="" /></div><span>contactus@psycube.com</span></li>
                <li><div className="contact_about_icon"><img src={Placeholder} alt="" /></div><span>7 Malik Manazer St, Ali Park Ali Park Lahore Cantt, Lahore, Punjab 54000</span></li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="col-lg-6 form_col">
              <div className="contact_form_container">
                <form onSubmit={handleSubmit(handleFormSubmit)} id="contact_form" className="contact_form">
                  <div className="row">
                    <div className="col-md-6 input_col">
                      <div className="input_container input_name"><input type="text" className="contact_input" placeholder="Name" {...register('name')} />
                        {errors.name && (
                          <p className="error-message">{errors.name.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 input_col">
                      <div className="input_container"><input type="email" className="contact_input" placeholder="E-mail" {...register('email')} />
                        {errors.email && (
                          <p className="error-message">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="input_container"><input type="text" className="contact_input" placeholder="Subject" {...register('subject')} />
                    {errors?.subject && (
                      <p className="error-message">{errors.subject?.message}</p>
                    )}</div>
                  <div className="input_container"><textarea className="contact_input contact_text_area" placeholder="Message" {...register('message')} />
                    {errors.message && (
                      <p className="error-message">{errors.message.message}</p>
                    )}
                  </div>
                  <button type='submit' className="button contact_button"><span>Submit</span></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Contact;
