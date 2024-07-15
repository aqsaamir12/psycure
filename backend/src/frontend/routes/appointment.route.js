const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointment.controller');

// Route to create a new appointment
router.post('/', appointmentController.createAppointment);

// Route to get appointments for a specific user
router.get('/:userId', appointmentController.getAppointment);

// Route to get appointments for a specific therapist
router.get('/therapist/:therapistId', appointmentController.getTherapistAppointment);

// Route to get appointment history for a specific therapist
router.get('/history/:therapistId', appointmentController.getAppointmentHistory);

// Route to get a single appointment by ID
router.get('/get/:id', appointmentController.getSingleAppointment);

// Route to update an appointment
router.put('/:id', appointmentController.update);

// Route to create a payment intent for an appointment
router.post('/create-payment-intent', appointmentController.payment);

module.exports = router;
