const mongoose = require('mongoose');

const appointmentFeedbackSchema = new mongoose.Schema(
    {
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: {
            type: String,
            required: true,
          },
        rating: { type: Number, max: 5},
    }
);

module.exports = mongoose.model('AppointmentFeedback', appointmentFeedbackSchema);
