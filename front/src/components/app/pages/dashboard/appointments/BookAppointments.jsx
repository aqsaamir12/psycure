import React, { useEffect, useState } from "react";
import './DoctorTable.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import textSection from '../../../../../assets/images/text_section.jpg';
import FullPageLoader from "../../../../pages/PageNotFound/FullPageLoader";

/**
 * Component for booking appointments with therapists.
 * 
 * @returns {JSX.Element} BookAppointments component.
 */
function BookAppointments() {
   // Define state variables and hooks
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterFee, setFilterFee] = useState(150000);
  const [therapists, setTherapistData] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTherapistData();
  }, []);


  // Apply filters whenever filter criteria or therapist data changes
  useEffect(() => {
    applyFilters();
  }, [filterName, filterRating, filterLocation, filterFee, therapists]);

  // Set filtered therapists whenever therapist data changes
  useEffect(() => {
    setFilteredTherapists(therapists);
}, [therapists]);

// Function to fetch therapist data from the server
  const fetchTherapistData = async () => {
    try {
      const response = await api.get(`${ENV.appClientUrl}/therapistData/list`);
      if (response?.data?.success) {
        setIsLoading(false);
        setTherapistData(response?.data?.therapists);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };


   // Function to apply filters to therapist data
  const applyFilters = () => {
    let filteredTherapistsCopy = therapists.slice(); 

    filteredTherapistsCopy = filteredTherapistsCopy?.filter(therapist => {
        return (
            (filterName === "" || 
                `${therapist.fname} ${therapist.lname}`.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterRating === 0 || therapist.ratings === filterRating) &&
            (filterLocation === "All Locations" || therapist?.location === filterLocation) &&
            (filterFee === 0 || therapist?.fee <= filterFee)
        );
    });

    setFilteredTherapists(filteredTherapistsCopy);
};

// Event handler for name filter change 
  const handleNameFilterChange = (e) => {
    setFilterName(e.target.value?.toLowerCase());
  };

    // Event handler for rating filter change
  const handleRatingFilterChange = (e) => {
    setFilterRating(Number(e.target.value));
  };


   // Event handler for location filter change
  const handleLocationFilterChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleFeeChange = (e) => {
    setFilterFee(Number(e.target.value));
  };

  // Function to navigate to appointment confirmation page
  const handleBookAppointment = (therapistId, serviceId) => {
    navigate(`/confirm-appointment/${therapistId}/${serviceId}`);
  };

  if (isLoading) {
    return <FullPageLoader />;
}
  return (
    <div className="dash Therapists_Wrap">
      <div className="therapist-page-container">
        <h1 className="main-title"><span>Search</span> for Therapists</h1>
        <div className="therapist-table-container">
          <div className="filter_wrap">
            <div className="row ">
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={filterName}
                  onChange={handleNameFilterChange}
                  className="customInput"
                />
              </div>
              <div className="col-md-4">
                <select onChange={handleRatingFilterChange} className="customInput">
                  <option value="0">All Ratings</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="col-md-4">
                <select onChange={handleLocationFilterChange} className="customInput">
                  <option>All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>
          <input
            type="range"
            min="1000"
            max="150000"
            value={filterFee}
            onChange={handleFeeChange}
            step="100"
          />
          <p className="range-number">Fee Range: Up to <span>{filterFee}</span> </p>

        </div>

        <div className="card_listing mt-5">
        <div className="row">
  {filteredTherapists?.length > 0 ? (
    filteredTherapists?.map((data, index) => (
      <div className="col-md-3" key={index}>
        <div className="card">
          <img src={data?.profileImage ? `${ENV.file_Url}/` + data?.profileImage : textSection} className="card-img-top" alt="textSection" />
          <h3>{data?.fname} {data?.lname}</h3>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Experience
              <span className="badge badge-primary badge-pill">{data?.yearsOfExp} year</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Location
              <span className="badge badge-primary badge-pill">{data?.location}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Fee (PKR)
              <span className="badge badge-primary badge-pill">{data?.fee}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Rating
              <span className="badge badge-primary badge-pill">{data?.ratings}</span>
            </li>
            <li className="list-group-item">
              <div className="therapists_btn">
                <button onClick={() => handleBookAppointment(data?._id, data?.service_id)} className="w-100">Book Appointment</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    ))
  ) : (
    <div className="col-md-12">
      <div className="alert alert-info" role="alert">
        No record found.
      </div>
    </div>
  )}
</div>
  </div>
      </div>
    </div>
  );
}

export default BookAppointments;