 
import React, { useEffect, useState } from "react"; 
import './Availability.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import api from "../../../../../config/axios_instance";
import { ENV } from "../../../../../config/config";
import { toast } from "react-toastify";

// Days of the week object for displaying day names
const days = {
  "Monday": "Monday",
  "Tuesday": "Tuesday",
  "Wednesday": "Wednesday",
  "Thursday": "Thursday",
  "Friday": "Friday",
  "Saturday": "Saturday",
  "Sunday": "Sunday"
};

/**
 * Component for managing therapist availability.
 * 
 * @returns {JSX.Element} Availability component.
 */
export default function Availability() { 

  const user = JSON.parse(localStorage.getItem("user"));

   // State variables and hooks
  const [addShow, setAddShow] = useState(false);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [schedualSlots, setSchedualSlots] = useState(
    {
      Monday: [{ startTime: "", endTime: "" }],
      Tuesday: [{ startTime: "", endTime: "" }],
      Wednesday: [{ startTime: "", endTime: "" }],
      Thursday: [{ startTime: "", endTime: "" }],
      Friday: [{ startTime: "", endTime: "" }],
      Saturday: [{ startTime: "", endTime: "" }],
      Sunday: [{ startTime: "", endTime: "" }],
    }
  );

    /**
   * Function to fetch availability data from the server.
   * This function sends a GET request to the server to fetch availability data for the current therapist.
   * The fetched data is then used to update the state variable 'schedualSlots'.
   */
  const fetchData = async () => {
    try {
      const response = await api.get(`${ENV.appClientUrl}/availability?therapistId=${user?.id}`);
      if (response.data?.success) {
        setSchedualSlots(response.data?.data?.reduce((acc, obj) => {
          if (obj.day) {
            acc[obj.day] = obj.schedualSlots;
          }
          return acc;
        }, { ...schedualSlots }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };
  
  useEffect(()=>{
    fetchData();
  },[])


    /**
   * Function to handle adding availability time slot.
   * This function is called when the user submits the add availability form.
   * It validates the input fields and sends a POST request to the server to add the new time slot.
   * If successful, it updates the state with the new availability data and resets the input fields.
   *
   * @param {Event} e - The form submit event.
   */
  const handleAddAvailability = async (e) => {
    e.preventDefault();
    let isValid = true;
    const errors = {
      startTimeError: "",
      endTimeError: "",
    }
    if (startTime === "") {
      errors.startTimeError = "Start time should not be empty";
      isValid = false;
    } else if (endTime === "") {
      errors.endTimeError = "End time should not be empty";
      isValid = false;
    }

    if (endTime !== "" && startTime !== "") {
      const endTimeValue = new Date(endTime);
      const startTimeValue = new Date(startTime);

      if (endTimeValue < startTimeValue) {
        errors.endTimeError = "End Time cannot be earlier than Start Time";
        isValid = false;
      }
    }

    if (!isValid) {
      // setFormErrors(errors);
      return;
    }
try {
  const response = await api.post(`${ENV.appClientUrl}/availability`,{ day, startTime, endTime, therapistId: user?.id});
   if(response?.data?.success){
    toast.success(response?.data?.message)
    setDay(day);
    setStartTime("");
    setEndTime("")
    fetchData();
   }else{
    toast.error(response?.data?.message)
   }
} catch (error) {
  toast.error(error?.response?.data?.message)
}
   
  };

   /**
   * Function to handle deleting availability time slot.
   * This function is called when the user clicks the delete button on an existing time slot.
   * It sends a DELETE request to the server to remove the selected time slot.
   * If successful, it updates the state with the updated availability data.
   *
   * @param {string} _id - The ID of the time slot to be deleted.
   * @param {string} day - The day of the week for the time slot.
   */
  const handleDelete = async (_id, day) => {
    try {
      const response = await api.delete(`${ENV.appClientUrl}/availability?slotId=${_id}&day=${day}`);
      if(response?.data?.success){
        toast.success(response?.data?.message)
        fetchData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
   

  }

   /**
   * Function to format time in 12-hour format.
   *
   * @param {string} time - The time string to be formatted.
   * @returns {string} The formatted time string in 12-hour format.
   */
  function formatTime(time) {
    const [hours, minutes] = time.split(':');
    let formattedTime = `${parseInt(hours, 10) % 12}:${minutes}`;
    formattedTime += parseInt(hours, 10) >= 12 ? ' PM' : ' AM';
    return formattedTime;
  }
  return (
     <div className="dash">
      <div className="availability_wrap"> 
          <h1 className="main-title text-left">Available <span>times</span></h1>
          <div className="card">
              <div className="availability_inner">
              {Object.entries(schedualSlots).map(([dayKey, slots]) => {
                  const arabicDay = days[dayKey];
                  return ( 
                  <div className="availability_item"> 
                  <div className="availability_days">
                     <h6>{arabicDay}</h6>
                    </div> 
                    {slots?.map((slot, index) => {
                            return (
                              <>
                    {slot.startTime && slot.endTime ?<div className="availability_timing">
                      <span>{formatTime(slot.startTime)}  -  {formatTime(slot.endTime)}</span>
                      <div className="cross_wrapper"onClick={(e) => {
                                    handleDelete(slot?._id, dayKey)
                                  }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </div> 
                    </div> : ""}
                   
                    <div className="therapists_btn ">
                    
                     
                  </div>
                        </>
               
                  )
                })}  
                <button 
                    onClick={(e) => {
                                setDay(dayKey)
                                setAddShow(true);
                              }}
                                data-toggle="modal" data-target=".add_availability_modal">
                    <FontAwesomeIcon icon={faPlus}/>
                      </button>
                </div>  
                  ) 
                })}          
              </div>
          </div>
         </div>


 
 

{/* <!-- Modal --> */}
{addShow && (
<div className="modal fade add_availability_modal" show={addShow} onHide={() => { setAddShow(false); }}  data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="add_availability_modalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" >
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Add available time</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <form className="" onSubmit={handleAddAvailability}>
          <div className="form-group">
            <label className="form-label" for="date">today
            </label>
            <input type="day"  id="date" className="form-control"  disabled={true} value={day} />
          </div>
          <div className="form-group">
            <label className="form-label" for="startTime"> Start Time
            </label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required id="startTime" className="form-control"  />
          </div>
          <div className="form-group">
            <label className="form-label" for="endTime"> End Time
            </label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required id="endTime" className="form-control"  />
          </div>
          <div className="therapists_btn ">
          <button type="submit" className="submit_btn   w-100 mt-3">Add
          </button>
          </div>
        </form>
      </div> 
    </div>
  </div>
</div>
)}


     </div>
  );
}
