const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        scheduled_date: { type: Date, required: true },
        scheduled_time: {type: String, required: true},
        fee: { type: Number, required: true },
        zoom: { type: String, required: true },
        location: { type: String, required: true, enum: ['Remote', 'On-site'] },
        status: { type: Number,  enum: [0, 1, 2], default: 0},
        reason: {type: String, trim: true, max:50 },
        paid: {type: Boolean, default: false}
    },
        {timestamps: true}
);

module.exports = mongoose.model('Appointment', appointmentSchema);
