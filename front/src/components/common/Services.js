import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import serviceImage1 from '../../assets/images/service_1.svg';
import serviceImage2 from '../../assets/images/service_2.svg';
import serviceImage3 from '../../assets/images/service_3.svg';
import serviceImage4 from '../../assets/images/service_4.svg';
import serviceImage5 from '../../assets/images/service_5.svg';
import serviceImage6 from '../../assets/images/service_6.svg';
import api from '../../config/axios_instance';
import { ENV } from '../../config/config';

function Services() {

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
        <div className="services">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="section_title"><h2>Our Featured Services</h2></div>
                    </div>
                </div>
                <div className="row services_row">
                    {/* Service 1 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage1} alt="" /></div>
                                <div className="service_title trans_200">Free Checkups</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    {/* Service 2 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage2} alt="" /></div>
                                <div className="service_title trans_200">Screening Exams</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    {/* Service 3 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage3} alt="" /></div>
                                <div className="service_title trans_200">RMI Services</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    {/* Service 4 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage4} alt="" /></div>
                                <div className="service_title trans_200">Dentistry</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    {/* Service 5 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage5} alt="" /></div>
                                <div className="service_title trans_200">Neonatology</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    {/* Service 6 */}
                    <div className="col-lg-4 col-md-6 service_col">
                        <a href="#">
                            <div className="service text-center trans_200">
                                <div className="service_icon"><img className="svg" src={serviceImage6} alt="" /></div>
                                <div className="service_title trans_200">Biochemistry</div>
                                <div className="service_text">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ante leo, finibus quis est ut, tempor tincidunt ipsum. Nam consequat semper sollicitudin.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;
