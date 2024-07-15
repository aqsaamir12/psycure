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
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import ProfileIMg from "../../.././../../assets/images/profile-icon.jpg"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import FullPageLoader from "../../../../pages/PageNotFound/FullPageLoader";
import ProgressBar from "@ramonak/react-progress-bar";
import EyeHide from '../../.././../../assets/images/eye-hide.svg'
import EyeShow from '../../.././../../assets/images/eye-outline.svg'


/**
 * Functional component representing the user profile page.
 * 
 * This component allows users to view and update their profile information and change passwords.
 */
function User() {
  
  
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
    personality: yup.string().required("Personality type is required"),
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
      personalityType: "",
      oceanScores: {
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
      },
    },
    certification: "",
    yearsOfExp: "",
    profileImage: "",
    isTherapist: true,
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

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

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
        setValue("personality", response?.data?.userProfile?.personality?.personalityType);
        setValue("isTherapist", response?.data?.isTherapist);
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

    const formData = new FormData();
    formData.append('profileImage', image);
    formData.append('age', data.age);
    formData.append('email', data.email);
    formData.append('fname', data.fname);
    formData.append('lname', data.lname);
    formData.append('personality', data.personality);
    try {

      const response = await api.put(`${ENV.appClientUrl}/auth/profile/update/${user?.id}`, formData);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setUserProfile(response?.data?.user);
        fetchUserProfile();
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }

  };


  /**
 * Function to handle password change.
 * This function sends a PUT request to update the user's password with the provided data.
 * @param {Object} data - The password change data.
 */
  const handlePasswordChange = async (data) => {
    try {
      const url = `${ENV.appClientUrl}/auth/edit-password`;
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

                    <div className="d-flex  justify-content-between align-items-start">

                      <div>
                        <div className="profile-pic">
                          <label className="-label" htmlFor="file">
                            <span className="glyphicon glyphicon-camera"></span>
                            <span>Change Image</span>
                          </label>
                          <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                          <img className="prfl_wrap" src={image ? URL.createObjectURL(image) : (userProfile?.profileImage ? `${ENV.file_Url}/` + userProfile?.profileImage : ProfileIMg)} id="output" width="200" alt="Profile" />
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {/* {userProfile?.personality ?<div className="profile_badge mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            height="80px"
                            width="80px"
                            version="1.1"
                            id="Capa_1"
                            viewBox="0 0 47.94 47.94"
                            xmlSpace="preserve"
                          >
                            <path
                              style={{ fill: '#ff5722' }}
                              d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757  c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042  c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685  c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528  c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956  C22.602,0.567,25.338,0.567,26.285,2.486z"
                            />
                          </svg>
                          <div>
                            <span>{userProfile?.personality?.personalityType}</span>
                          </div>
                        </div>: ""} */}
                        <div>
                          <Link to="/personality-test">
                            <div className="therapists_btn"><button type="submit" className="mt-0 px-4 ">General Test</button></div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* <div className="progress_bar">
                      <div className="progressOne progress_wrapper">
                        <label htmlFor="">Agreeableness</label>
                        <ProgressBar completed={userProfile?.personality?.oceanScores?.Agreeableness? userProfile?.personality?.oceanScores?.Agreeableness : 0}
                        maxCompleted={50}
                          />
                      </div>
                      <div className="progresstwo progress_wrapper">
                      <label htmlFor="">Conscientiousness</label>
                        <ProgressBar completed={userProfile?.personality?.oceanScores?.Conscientiousness ? userProfile?.personality?.oceanScores?.Conscientiousness : 0}
                           maxCompleted={50} />
                      </div>
                      <div className="progressthree progress_wrapper">
                      <label htmlFor="">Extraversion</label>

                        <ProgressBar completed={userProfile?.personality?.oceanScores?.Extraversion ? userProfile?.personality?.oceanScores?.Extraversion : 0}
                           maxCompleted={50} />
                      </div>
                      <div className="progressfour progress_wrapper">
                      <label htmlFor="">Neuroticism</label>

                        <ProgressBar completed={userProfile?.personality?.oceanScores?.Neuroticism ? userProfile?.personality?.oceanScores?.Neuroticism : 0}
                           maxCompleted={50} />
                      </div>
                      <div className="progressfive progress_wrapper">
                      <label htmlFor="">Openness</label>

                        <ProgressBar completed={userProfile?.personality?.oceanScores?.Openness ? userProfile?.personality?.oceanScores?.Openness : 0}
                          maxCompleted={50}/>

                      </div>

                    </div> */}


                    <Row >

                      <Col md="6">
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
                      <Col md="6">
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
                      <Col md="6">
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
                      {/* <Col md="6">
                        <Form.Group className="form-group">
                          <label className="form-label">Personality</label>
                          <Form.Control
                          disabled={true}
                            className="customInput"
                            {...register('personality')}
                          ></Form.Control>
                          {errors.personality && (
                            <span className="red-error">{errors.personality.message}</span>
                          )}
                        </Form.Group>
                      </Col> */}

                      <Col md="6">
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


{!userProfile.isTherapist &&
            <Col md="12" className="mt-5">
  <h3 className="main-title text-left" ><span>Personality </span> Scores</h3>
  <Card >
    <Card.Body>
      {/* Personality Scores Section */}
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6">Agreeableness</Form.Label>
          <Col md="6">
            <div className="customInput score-value">{userProfile?.personality?.oceanScores?.Agreeableness || 0}%</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6">Conscientiousness</Form.Label>
          <Col md="6">
            <div className="customInput score-value">{userProfile?.personality?.oceanScores?.Conscientiousness || 0}%</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6">Extraversion</Form.Label>
          <Col md="6">
            <div className="customInput score-value">{userProfile?.personality?.oceanScores?.Extraversion || 0}%</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6">Neuroticism</Form.Label>
          <Col md="6">
            <div className="customInput score-value">{userProfile?.personality?.oceanScores?.Neuroticism || 0}%</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6">Openness</Form.Label>
          <Col md="6">
            <div className="customInput score-value">{userProfile?.personality?.oceanScores?.Openness || 0}%</div>
          </Col>
        </Form.Group>
      </Form>
    </Card.Body>
  </Card>
</Col>
}









            <Col md="12" className="mt-5">
              <h3 className="main-title text-left"><span>Change </span> Password</h3>
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSubmitPassword(handlePasswordChange)}>
                    <Row>
                      <Col className="" md="4">
                        <Form.Group className="form-group">
                          <label className="form-label">Current Password</label>
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
                          <label className="form-label">New Password</label>
                   <div className="relative">
                   <Form.Control
                            placeholder="new password"
                            type={showRepeatPassword ? 'text' : 'password'}
                            {...registerPassword('newPassword')}
                            className="customInput"
                          ></Form.Control>
                           	<div  className='eye_button top-5'>
                              <button type="button" onClick={(e) => toggleRepeatPasswordVisibility(e)}>
                                {showRepeatPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
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
                          <label className="form-label">Confirm Password</label>
                          <div className="relative">
                          <Form.Control
                            placeholder="confirm password"
                            {...registerPassword('confirmPassword')}
                            type={showPassword ? 'text' : 'password'}
                            className="customInput"
                          ></Form.Control>
                           	<div  className='eye_button top-5'>
                              <button type="button" onClick={(e) => togglePasswordVisibility(e)}>
                                {showPassword ? <img src={EyeHide} alt="Hide" /> : <img src={EyeShow} alt="Show" />} 
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

export default User;
