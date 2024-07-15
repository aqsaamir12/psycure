import React, { useEffect, useState } from "react";
import './Profile.css';
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import ProfileIMg from "../../.././../../assets/images/profile-icon.jpg"
import FullPageLoader from "../../../../pages/PageNotFound/FullPageLoader";
import EyeHide from '../../.././../../assets/images/eye-hide.svg'
import EyeShow from '../../.././../../assets/images/eye-outline.svg'

function TherapistUser() {
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setcurrentPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);


  const togglePasswordVisibility = (e) => {
    e.preventDefault();
      setShowPassword(!showPassword);
    };

    const toggleCurrentPasswordVisibility = (e) => {
      e.preventDefault();
      setcurrentPassword(!currentPassword);
      };
    const toggleRepeatPasswordVisibility = (e) => {
      e.preventDefault();
      setShowRepeatPassword(!showRepeatPassword);
    };
  
  const schema = yup.object().shape({
    fname: yup.string().required("First name is required"),
    lname: yup.string().required("Last name is required"),
    age: yup.string().required("Age is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
  certification: yup.string().required("Certification is required"),
  yearsOfExp: yup.number().required("Years of experience is required"),
  });

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current Password is Required'),
    newPassword: yup
        .string()
        .required('New Password is Required')
        .min(6, 'New password Must be at Least 6 Characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\]:;<>,.?~\\-])/,
            'New password Must Contain at Least One Upper-Case Letter, One Lower-Case Letter, And One Symbol'
        ),
    confirmPassword: yup
        .string()
        .required('Confirm Password is Required')
        .oneOf([yup.ref('newPassword'), null], 'Passwords Must Match'),
});

  const [userProfile, setUserProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    personality: {
      personalityType: ""
    },
    profileImage: "",
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

  const {
    handleSubmit: handleSubmitPassword,
    register: registerPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
} = useForm({ resolver: yupResolver(passwordSchema) });

  useEffect(() => {
    fetchUserProfile();
  }, []);


   /**
 * Fetch user profile data from the API.
 * This function sends a GET request to the API endpoint for fetching user profile data.
 * Upon receiving the response, it updates the form fields and user profile state accordingly.
 */
    const fetchUserProfile = async () => {
    try {

      const response = await api.get(`${ENV.appClientUrl}/auth/profile/${user?.id}`);
      if (response?.data?.success) {
        setIsLoading(false);
        setValue("fname", response?.data?.userProfile?.fname);
        setValue("lname", response?.data?.userProfile?.lname);
        setValue("email", response?.data?.userProfile?.email);
        setValue("age", response?.data?.userProfile?.age);
        setValue("certification", response?.data?.userProfile?.certification);
        setValue("yearsOfExp", response?.data?.userProfile?.yearsOfExp);
        setUserProfile(response?.data?.userProfile);
      } else {
        setIsLoading(false);
        toast.error(response?.data?.message)
      }

    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message)
    }
  };


   /**
 * Function to handle profile update.
 * This function sends a PUT request to update the user profile with the provided data.
 * @param {Object} data - The updated profile data.
 */
  const handleUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
            formData.append('profileImage', image);
            formData.append('age', data.age);
            formData.append('certification', data.certification);
            formData.append('email', data.email);
            formData.append('fname', data.fname);
            formData.append('lname', data.lname);
            formData.append('yearsOfExp', data.yearsOfExp);
      const response = await api.put(`${ENV.appClientUrl}/auth/profile/update/${user?.id}`, formData);
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        setUserProfile(response?.data?.user);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    
    img.onload = function() {
      if (img?.height < 300) {
        toast.error("Image height must be at least 300 pixels.");
      } else {
        setImage(file);
      }
    };
  };

  reader.readAsDataURL(file);
};

/**
 * Function to handle password change.
 * This function sends a PUT request to update the therapist's password with the provided data.
 * @param {Object} data - The password change data.
 */
const handlePasswordChange = async (data) => {
  try {
      const url = `${ENV.appClientUrl}/therapistData/edit-password`;
      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      };
      const requestBody = {
          _id: user?.id,
          current: data.currentPassword,
          new: data.newPassword,
          confirm: data.confirmPassword,
      };
      const res = await api.put(url, requestBody, config);
      if (res?.data) {
          const { data } = res;
          toast.success(data?.message);
          resetPasswordForm();
      }
  } catch (error) {
      toast.error(error.response.data.message);
  }
};

if (isLoading) {
  return <FullPageLoader />;
}
return (
  <div className="dash">
  <div className="profile-form">
    <Container fluid>
      <Row>
        <Col md="12">
        <h3 className="main-title text-left"><span>Edit</span> Profile</h3>
          <Card> 
            <Card.Body>
            <Form onSubmit={handleSubmit(handleUpdateProfile)}>
                <div>
                <div className="profile-pic">
                    <label className="-label" htmlFor="file">
                      <span className="glyphicon glyphicon-camera"></span>
                      <span>Change Image</span>
                    </label>
                    <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                    <img className="prfl_wrap" src={image ? URL.createObjectURL(image) : (userProfile?.profileImage ? `${ENV.file_Url}/` + userProfile?.profileImage : ProfileIMg)}  id="output" width="200" alt="Profile" />
                  </div>
                </div>
         
                <Row>
           
                  <Col  md="6">
                    <Form.Group className="form-group">
                      <label className="form-label">First Name</label>
                      <Form.Control
                       {...register('fname')}
                        placeholder="First Name"
                        type="text"
                        className="customInput"
                      ></Form.Control>
                      {errors.fname && (
                <span className="red-error">{errors.fname.message}</span>
              )}
                    </Form.Group>
                  </Col>
                  <Col   md="6">
                    <Form.Group className="form-group"> 
                      <label className="form-label">Last Name</label>
                      <Form.Control
                          {...register('lname')}
                        placeholder="Last Name"
                        type="text"
                        className="customInput"
                       
                      ></Form.Control>
                      {errors.lname && (
                <span className="red-error">{errors.lname.message}</span>
              )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col  md="6">
                    <Form.Group className="form-group">
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                      </label>
                      <Form.Control
                       {...register('email')}
                      placeholder="Email Address"
                      type="email"
                      className="customInput"
                    
                      ></Form.Control>
                        {errors.email && (
                <span className="red-error">{errors.email.message}</span>
              )}
                    </Form.Group>
                  </Col>
                  <Col   md="6">
                    <Form.Group className="form-group"> 
                      <label className="form-label">Age</label>
                      <Form.Control
                       {...register('age')}
                       className="customInput" 
                      ></Form.Control>
                        {errors.age && (
                <span className="red-error">{errors.age.message}</span>
              )}
                    </Form.Group>
                  </Col>
                   <Col   md="6">
                    <Form.Group className="form-group"> 
                      <label className="form-label">Years Of Experience</label>
                      <Form.Control
                      {...register('yearsOfExp')}
                       className="customInput" 
                      ></Form.Control>
                          {errors.yearsOfExp && (
                <span className="red-error">{errors.yearsOfExp.message}</span>
              )}
                    </Form.Group>
                  </Col>
                  <Col   md="6">
                    <Form.Group className="form-group"> 
                      <label className="form-label">Certification</label>
                      <Form.Control
                      {...register('certification')}
                       className="customInput" 
                      ></Form.Control>
                          {errors.certification && (
                <span className="red-error">{errors.certification.message}</span>
              )}
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
                    Update Profile
                  </Button>
                  </div>
                  </Col>
                </Row>
                
               
                <div className="clearfix"></div>
              </Form>
            </Card.Body>
          </Card>
        </Col> 
        <Col md="12" className="mt-5">
        <h3 className="main-title text-left"><span>Change </span> Password</h3>
          <Card> 
            <Card.Body>
              <Form onSubmit={handleSubmitPassword(handlePasswordChange)}>
                <Row>
                <Col className="" md="4">
                    <Form.Group className="form-group"> 
                      <label className="form-label">CURRENT PASSWORD</label>
                      <div className="relative">
                      <Form.Control 
                        placeholder="current password"
                        {...registerPassword('currentPassword')}
                        type={currentPassword ? 'text' : 'password'}
                        className="customInput" 
                      ></Form.Control>
                      	<div  className='eye_button top-5'>
                              <button type="button" onClick={(e) => toggleCurrentPasswordVisibility(e)}>
                                {currentPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
                              </button>
                            </div>
                       {passwordErrors.currentPassword && (
                <span className="red-error">{passwordErrors.currentPassword.message}</span>
              )}
                      </div>
            
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group className="form-group">
                      <label className="form-label">NEW PASSWORD</label>
                      <div className="relative">
                      <Form.Control 
                        placeholder="new password"
                        type={showPassword ? 'text' : 'password'}
                        {...registerPassword('newPassword')}
                        className="customInput" 
                      ></Form.Control>
                          	<div  className='eye_button top-5'>
                              <button type="button" onClick={(e) => togglePasswordVisibility(e)}>
                                {showPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
                              </button>
                            </div>
                       {passwordErrors.newPassword && (
                <span className="red-error">{passwordErrors.newPassword.message}</span>
              )}
                      </div>
          
                    </Form.Group>
                  </Col>
                
                  <Col className="" md="4">
                    <Form.Group className="form-group"> 
                      <label className="form-label">CHANGE PASSWORD</label>
                      <div className="relative">
                      <Form.Control 
                        placeholder="change password"
                        {...registerPassword('confirmPassword')}
                        type={showRepeatPassword ? 'text' : 'password'}
                        className="customInput" 
                      ></Form.Control>
                          	<div  className='eye_button top-5'>
                              <button type="button" onClick={(e) => toggleRepeatPasswordVisibility(e)}>
                                {showRepeatPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
                              </button>
                            </div>
                        {passwordErrors.confirmPassword && (
                <span className="red-error">{passwordErrors.confirmPassword.message}</span>
              )}
                      </div>
       
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
                  Password Confirmation
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
);
}

export default TherapistUser;
