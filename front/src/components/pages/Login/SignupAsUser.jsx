import React, { useState } from 'react';
import './SignupAsUser.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../config/axios_instance';
import { ENV } from '../../../config/config';
import Syyto from '../../../assets/images/syyto.png'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SignupAsTherapist from "../../pages/Login/SignupAsTherapist";
import PSYCUBE from "../../../assets/images/cure-logo2.png"
import EyeHide from '../../../assets/images/eye-hide.svg'
import EyeShow from '../../../assets/images/eye-outline.svg'

/**
 * Signup component for user registration.
 * Allows users to sign up with required information.
 *
 * @component
 */
const Signup = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  /**
   * Toggles password visibility.
   *
   * @param {Event} e - The event object.
   */
	const togglePasswordVisibility = (e) => {
	  e.preventDefault();
	  setShowPassword(!showPassword);
	};

  const toggleRepeatPasswordVisibility = (e) => {
	  e.preventDefault();
	  setShowRepeatPassword(!showRepeatPassword);
	};

  const schema = yup.object().shape({
    fname: yup.string().required('First Name is Required'),
    lname: yup.string().required('Last Name is Required'),
    email: yup
      .string()
      .required('Email is Required')
      .email('Invalid Email. Please enter a valid email e.g (aqsa@gmail.com)'),
    password: yup.string().required('Enter valid password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
        'Password: 1 lowercase, 1 uppercase, 1 digit, 1 special character, 8-15 characters.'
      ),
    repassword: yup.string().required('Passwords must match')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    age: yup.number().required('Enter valid age')
      .min(18, 'Age must be at least 18 years')
      .typeError('Age is Required'),
  });

  // useForm hook for handling form submission and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * Handles form submission for user signup.
   *
   * @param {Object} data - Form data submitted by the user.
   */
  const handleFormSubmit = async (data) => {

    try {
      const response = await api.post(`${ENV.appClientUrl}/auth/signup`, data);
      if (response?.data?.success) {
        toast.success(response.data?.message);
        navigate('/login');
        reset();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(error?.response.data?.message);

    }
  };

  return (
    <div className="sign-form sign_user_wraper">
      <Link to="/" className='site__logo'><img src={PSYCUBE} alt='logo' /></Link>
      <div className='auth_user_content d-flex'>
        <div className='left_auth'>
          <img src={Syyto} alt="syto" />
        </div>
        <div className="sign-body signin__therapist" id="container">
          <h1 className='pt-5'>Create Account</h1>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Sign Up as a User">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                  type="text"
                  {...register('fname')}
                  placeholder="First Name"
                />
                {errors.fname && (
                  <p className="red-error">{errors.fname.message}</p>
                )}

                <input
                  type="text"
                  {...register('lname')}
                  placeholder="Last Name"
                />
                {errors.lname && (
                  <p className="red-error">{errors.lname.message}</p>
                )}

                <input
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="red-error">{errors.email.message}</p>
                )}
                <div className='relative'>
                <input
                 type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter Password"
                />
                    <div  className='eye_button'>
                      <button type="button"  onClick={(e) => togglePasswordVisibility(e)}>
                        {showPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
                      </button>
                    </div>
                {errors.password && (
                  <p className="red-error">{errors.password.message}</p>
                )}
                </div>
                <div className='relative'>
                <input
                  type={showRepeatPassword ? 'text' : 'password'}
                  {...register('repassword')}
                  placeholder="Re-Enter Password"
                />
                   <div  className='eye_button'>
                      <button type="button"  onClick={(e) => toggleRepeatPasswordVisibility(e)}>
                        {showRepeatPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
                      </button>
                    </div>
                {errors.repassword && (
                  <p className="red-error">{errors.repassword.message}</p>
                )}
                </div>

           
                <input
                  type="number"
                  {...register('age')}
                  placeholder="Enter Age"
                />
                {errors.age && (
                  <p className="red-error">{errors.age.message}</p>
                )}
                <div className=''>
                  <button type="submit">Sign Up</button>
                  <p className='pt-3'>Already have an Account? <Link to="/login" className='font-s-20'>Log in</Link></p>
                </div>

              </form>
            </Tab>
            <Tab eventKey="profile" title="Sign Up as a Therapist">
              <SignupAsTherapist />
            </Tab>
          </Tabs>

        </div>
      </div>

    </div>
  );
};

export default Signup;
