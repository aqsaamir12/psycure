import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../config/axios_instance';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Syyto from '../../../assets/images/syyto.png'
import EyeHide from '../../../assets/images/eye-hide.svg'
import EyeShow from '../../../assets/images/eye-outline.svg'


import PSYCUBE from "../../../assets/images/cure-logo2.png"
import { ENV } from '../../../config/config';
import LoginTherapist from './LoginTherapist';
import { useState } from 'react';

/**
 * Functional component for the Login page.
 *
 * This component provides a form for users to log in.
 *
 * @component
 * @returns {JSX.Element} Login component
 */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

   /**
   * Toggles password visibility.
   *
   * @param {Event} e - The event object
   */
  const togglePasswordVisibility = (e) => {
	e.preventDefault();
    setShowPassword(!showPassword);
  };
	const navigate = useNavigate()

	const schema = yup.object().shape({
		email: yup.string().email('Invalid Email.').required('Email is Required'),
		password: yup.string().required('Enter valid password'),
	});



	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	  /**
   * Handles form submission.
   *
   * @param {Object} data - Form data
   */
	const handleFormSubmit = async (data) => {
		try {
			const response = await  api.post(`${ENV.appClientUrl}/auth/login`, data)
			if (response.data?.success) {
				
				toast.success("Login Successful")
				ENV.encryptUserData(response?.data?.user, response?.data?.accessToken, response?.data?.user?.id);
				reset();
				if (response.data?.isTherapist) {
					navigate("/therapist/dashboard")
				}
				else if (response.data?.user?.personality === null) {
					navigate("/personality-test")
				}
				else {
					navigate("/users/dashboard")
				}
			}
			else {
				toast.error(response?.data?.message)
			}

		} catch (error) {
			toast.error(error?.response.data?.message)
		}
	};


	

	return (
		<div className="sign-form sign_user_wraper">
			<Link to="/" className='site__logo'><img src={PSYCUBE} alt='logo'/></Link>
      <div className='auth_user_content d-flex'>
	  <div className='left_auth'>
        <img src={Syyto} alt="syto"/>
      </div>
	  <div className="form-body" id="container">
	  <h1>HI,Welcome</h1>
				<div className="sign-body signin__therapist">
					<Tabs
						defaultActiveKey="profile"
						id="uncontrolled-tab-example"
						className="mb-3"
					>
						<Tab eventKey="home" title="Sign In as a User">
							<form onSubmit={handleSubmit(handleFormSubmit)}>
								<input
									type="email"
									{...register('email')}
									placeholder="Email"
									autoComplete="new-password"
								/>
								{errors.email && (
									<p className="red-error">{errors.email.message}</p>
								)}
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										{...register('password')}
										placeholder="Enter Password"
										autoComplete="new-password"
										className='login_input'
									/>
								<div  className='eye_button'>
								<button type="button" onClick={(e) => togglePasswordVisibility(e)}>
									{showPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
								</button>
								</div>
									{errors.password && (
										<p className="red-error">{errors.password.message}</p>
								)}
								</div>
						
								<button type='submit'>Log In</button>
								<p className='pt-3'>Don't have an Account? <Link to="/signup" className='font-s-20'>Sign Up</Link></p>

							</form>
						</Tab>
						<Tab eventKey="profile" title="Sign In as a Therapist">
							<LoginTherapist/>
						</Tab>
					</Tabs>

				</div>
			</div>
	  </div>

	
		
		</div>
	)
}

export default Login