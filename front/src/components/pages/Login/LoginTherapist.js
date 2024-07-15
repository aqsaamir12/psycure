import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../config/axios_instance';
import { ENV } from '../../../config/config';
import { useState } from 'react';
import EyeHide from '../../../assets/images/eye-hide.svg'
import EyeShow from '../../../assets/images/eye-outline.svg'

/**
 * Functional component for the LoginTherapist form.
 *
 * This component provides a form for therapists to log in.
 *
 * @component
 * @returns {JSX.Element} LoginTherapist component
 */
const LoginTherapist = () => {
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
   * Fetches therapist appointments.
   *
   * @param {string} id - Therapist ID
   */
	const fetchTherapistAppointments = async (id) => {
		try {
			const today = new Date();
			const response = await api.get(`${ENV.appClientUrl}/appointment/therapist/${id}`);
			if (response?.data?.success) {
				const appointmentsToday = response.data?.appointments?.filter(appointment => {
					const appointmentDay = new Date(appointment?.scheduled_date);
                return appointmentDay.toDateString() === today.toDateString() && appointment?.status === 0;
				});
				if (appointmentsToday?.length > 0) {
					toast.info(`You have ${appointmentsToday.length} appointments today.`);
				} else {
					toast.info("You have no appointments today.");
				}
			}
		} catch (error) {
			console.error("Error fetching therapist appointments:", error);
		}
	};

	 /**
   * Handles form submission for therapist login.
   *
   * @param {Object} data - Form data
   */
    const handleTherapistFormSubmit = async (data) => {

		try {
			const response = await api.post(`${ENV.appClientUrl}/therapistData/login`, data);
			if (response?.data?.success) {
				reset();
				ENV.encryptUserData(response?.data?.user, response?.data?.accessToken, response?.data?.user?.id);
				fetchTherapistAppointments(response?.data?.user?.id);
					navigate("/therapist/dashboard")
			} else {
				toast.error(response?.data?.message);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

  return (
    <div>
        <form onSubmit={handleSubmit(handleTherapistFormSubmit)}>

    <input
        type="email"
        {...register('email')}
        placeholder="Email"
        // autoComplete="new-password"
    />
    {errors.email && (
        <p className="red-error">{errors.email.message}</p>
    )}
	<div className='relative'>
	<input
        type={showPassword ? 'text' : 'password'}
        {...register('password')}
        placeholder="Enter Password"
        // autoComplete="new-password"
    />
		<div  className='eye_button'>
			<button type="button"  onClick={(e) => togglePasswordVisibility(e)}>
				{showPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
			</button>
		</div>
	</div>
   
    {errors.password && (
        <p className="red-error">{errors.password.message}</p>
    )}
    <button type='submit'>Log In</button>
    <p className='pt-3'>Don't have an Account? <Link to="/signup" className='font-s-20'>Sign Up</Link></p>
</form></div>
  )
}

export default LoginTherapist