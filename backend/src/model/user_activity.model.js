const mongoose = require('mongoose');

const patientActivitySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    },
        {timestamps: true}
);

module.exports = mongoose.model('PatientActivity', patientActivitySchema);
