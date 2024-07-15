import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout/Layout';
import Home from "./components/Home/Home"
import Login from './components/pages/Login/Login';
import SignupAsUser from './components/pages/Login/SignupAsUser';
import PersonalityTest from './components/pages/Login/PersonalityTest';
import Dashboard from './components/app/pages/dashboard/Dashboard/Dashboard';
import Payments from './components/app/pages/dashboard/Payment-History/Payments';
import Schedule from './components/app/pages/dashboard/Payment-History/Schedule';
import Profile from './components/app/pages/dashboard/Profile/Profile';
import TherapistUser from './components/app/pages/dashboard/Profile/TherapistProfile';
import BookAppointments from './components/app/pages/dashboard/appointments/BookAppointments';
import DashboardLayout from './components/common/DashboardLayout';
import AboutUs from './components/pages/AboutUs/AboutUs';
import Contact from './components/pages/ContactUs/ContactUs';
import Services from './components/pages/Services/Services';
import ConfirmAppoinment from './components/app/pages/dashboard/Appointment/ConfirmAppoinment';
import Availability from './components/app/pages/dashboard/Availability/Availability';
import PageNotFound from './components/pages/PageNotFound/PageNotFound';
import PrivateRoute from './routeprotection/PrivateRoute';
import RatingAndReviews from './components/pages/RatingAndReviews/RatingAndReviews';
import AppoinmentHistory from './components/app/pages/dashboard/Payment-History/AppoinmentHistory';
import DetailPage from './components/app/pages/dashboard/DetailPage/DetailPage';
import ServicesHistoryTable from './components/app/pages/dashboard/Service-History/ServicesHistory';
import UpdateService from './components/app/pages/dashboard/Service-History/Edit';
import VoiceFlowChat from './VoiceFlowChat';

function App() {
  
  useEffect(() => {
    const loadScript = () => {
      // Create a script element
      const script = document.createElement('script');

      script.src ="https://static.zdassets.com/ekr/snippet.js?key=600c6856-2e30-405d-9cd6-b769f63a1aeb";

      script.id = "ze-snippet";

      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') {
      loadScript();
    } else {
      document.addEventListener('DOMContentLoaded', loadScript);
    }

    return () => {
      const script = document.getElementById('ze-snippet');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<Contact />} />

          </Route>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupAsUser />} />
          <Route path="/personality-test" element={<PersonalityTest />} />

          <Route path='/confirm-appointment/:therapistId/:serviceId' element={<PrivateRoute><ConfirmAppoinment /></PrivateRoute>} />

          {/* Private routes */}
          <Route path='/users' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/users/rating/:userId/:appointmentId" element={<PrivateRoute><RatingAndReviews /></PrivateRoute>} />
            <Route path='/users/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/users/payments' element={<PrivateRoute><Payments /></PrivateRoute>} />
            
            <Route path='/users/book-appointments' element={<PrivateRoute><BookAppointments /></PrivateRoute>} />
            <Route path='/users/schedule' element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path='/users/editprofile' element={<PrivateRoute><Profile /></PrivateRoute>} />

          </Route>

          <Route path='/therapist' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path='/therapist/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/therapist/services' element={<PrivateRoute><ServicesHistoryTable /></PrivateRoute>} />
            <Route path='/therapist/addservice' element={<PrivateRoute><Services /></PrivateRoute>} />
            <Route path='/therapist/edit/:id' element={<PrivateRoute><UpdateService /></PrivateRoute>} />
            <Route path='/therapist/history' element={<PrivateRoute><AppoinmentHistory /></PrivateRoute>} />
            <Route path='/therapist/availability' element={<PrivateRoute><Availability /></PrivateRoute>} />
            <Route path='/therapist/appointment/edit/:id' element={<PrivateRoute><DetailPage /></PrivateRoute>} />
            <Route path='/therapist/editprofile' element={<PrivateRoute><TherapistUser /></PrivateRoute>} />
          </Route>

          {/* Page not found */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
          <ToastContainer position="top-right" pauseOnHover newestOnTop autoClose={3000} />
      </BrowserRouter>
      <VoiceFlowChat/>
    </div>
  );
}

export default App;
