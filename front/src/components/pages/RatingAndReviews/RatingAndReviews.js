import React, { useState } from 'react'
import "./RatingAndReviews.css"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../config/axios_instance';
import { ENV } from '../../../config/config';
import { toast } from 'react-toastify';

/**
 * Displays the RatingAndReviews component.
 *
 * @returns {JSX.Element}
 */
function RatingAndReviews() {

  const navigate = useNavigate();
  const { userId, appointmentId } = useParams();
  const schema = yup.object().shape({
    message: yup.string().required('Review is required.')
  });
  const [rating, setRating] = useState(0);

  // useForm hook for handling form submission and validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  /**
 * Handles form submission for submitting ratings and reviews.
 *
 * @param {Object} data - Form data submitted by the user.
 */
  const onSubmit = async (data) => {
    try {
      data.userId = userId;
      data.appointmentId = appointmentId
      data.rating = rating
      const response = await api.post(`${ENV.appClientUrl}/testimonial`, data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/users/schedule")
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };
  const handleStarClick = (value) => {
    setRating(value);
  };


  return (
    <div className='reviews_wraper'>
      <div className=" reviews_content">

        <h1>How was your <span className='text_green'>Experience?</span></h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rating">
            <span id="rating">{rating}/5</span>
          </div>
          <div className="stars" id="stars">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star${index < rating ? ' active' : ''}`}
                data-value={index + 1}
                onClick={() => handleStarClick(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <p>Share your review:</p>
          <textarea
            id="review"
            placeholder="Write your review here"
            {...register('message')}
          />
          <div className='d-flex align-items-center flex-direct-column'> 
          {errors.message && <span className="red-error">{errors.message.message}</span>}
          <button className="custom_btn mt-2"><span>Submit</span></button>
          </div>

          <div className="reviews" id="reviews"></div>
        </form>
      </div>
    </div>

  )
}

export default RatingAndReviews
