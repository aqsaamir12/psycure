import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// function TherapistCard(props) {
//   const currentTherapist = props.therapist;
//   return (
//     <Card style={{ width: '18rem' }} className="mb-4">
//       <Card.Body className="d-flex flex-column align-items-center">
//         <Card.Title>{currentTherapist?.therapist?.fname} {currentTherapist?.therapist?.lname}</Card.Title>
//         <Card.Text className="text-center">
//           <p className="mb-2">Experience: {currentTherapist?.therapist?.yearsOfExp} years</p>
//           <p className="mb-2">Location: {currentTherapist?.location}</p>
//           <p className="mb-2">Fee: PKR {currentTherapist?.fee}</p>
//           <p className="mb-0">Ratings: {currentTherapist?.ratings}</p>
//         </Card.Text>
//         <Button
//           style={{ backgroundColor: '#2d4059' }} // Correct syntax for setting background color
//           variant="primary"
//           onClick={() => props.onBookAppointment(currentTherapist?.therapist?._id, currentTherapist?._id)}
//           className="mt-auto" // This class will push the button to the bottom of the card
//         >
//           Book Appointment
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// }

// TherapistCard.defaultProps = {
//   therapist: {
//     name: 'Default Name',
//     yearsOfExp: 'Default Experience',
//     location: 'Default Location',
//     fee: 'Default Fee',
//     ratings: 'Default Ratings',
//   },
//   onBookAppointment: () => {
//     console.log('Default Book Appointment');
//   },
// };

// export default TherapistCard;
function TherapistCard(props) {
  const currentTherapist = props.therapist;

  return (
    <Card style={{ width: '18rem' }} className="mb-4">
      <Card.Body className="d-flex flex-column align-items-center">
        <Card.Title>{currentTherapist.name}</Card.Title>
        <Card.Text className="text-center">
          <p className="mb-2">Experience: {currentTherapist.yearsOfExp} years</p>
          <p className="mb-2">Location: {currentTherapist.location}</p>
          <p className="mb-2">Fee: PKR {currentTherapist.fee}</p>
          <p className="mb-0">Ratings: {currentTherapist.ratings}</p>
        </Card.Text>
        <Button
          style={{ backgroundColor: '#2d4059' }} // Correct syntax for setting background color
          variant="primary"
          onClick={() => props.onBookAppointment(currentTherapist._id, currentTherapist.service_id)}
          className="mt-auto" // This class will push the button to the bottom of the card
        >
          Book Appointment
        </Button>
      </Card.Body>
    </Card>
  );
}

TherapistCard.defaultProps = {
  therapist: {
    name: 'Default Name',
    yearsOfExp: 'Default Experience',
    location: 'Default Location',
    fee: 'Default Fee',
    ratings: 'Default Ratings',
  },
  onBookAppointment: () => {
    console.log('Default Book Appointment');
  },
};

export default TherapistCard;