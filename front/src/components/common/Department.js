import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import departmentImage1 from '../../assets/images/dept_1.jpg';
import departmentImage2 from '../../assets/images/dept_2.jpg';
import departmentImage3 from '../../assets/images/dept_3.jpg';
import api from '../../config/axios_instance';
import { ENV } from '../../config/config';
import Slider from "react-slick";


function Department() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true
    };
    const [therapist, setTherapist] = useState([]);
    const fetchUserProfile = async () => {
        try {

            const response = await api.get(`${ENV.appClientUrl}/therapistData/all`);
            if (response?.data?.success) {
                setTherapist(response?.data?.newTherapist);
            } else {
                toast.error(response?.data?.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [])

    return (
        <div>
            <div className="departments">
                <div className="departments_background parallax-window" data-parallax="scroll" data-image-src="images/departments.jpg" data-speed="0.8"></div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="section_title section_title_light"><h2>Our Medical Departments</h2></div>
                        </div>
                    </div>

                    <div className=" departments_row row-md-eq-height">
                        <Slider {...settings}>
                        {therapist?.slice(0, 4).map((data, index) => {
                            return (
                                    <div key={index} className=" dept_col">
                                        <Link to='/users/book-appointments'>
                                                <div className="dept">
                                                    <div className="dept_image"><img src={data?.therapist?.profileImage ? `${ENV.file_Url}/` + data?.therapist?.profileImage : departmentImage1} alt="" /></div>
                                                    <div className="dept_content text-center">
                                                        <div className="dept_title">{data?.name}</div>
                                                        <div className="dept_subtitle">Dr {data?.therapist?.fname} {data?.therapist?.lname}</div>
                                                    </div>
                                                </div>
                                        </Link>
                                    </div>
                            );
                        })}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Department
