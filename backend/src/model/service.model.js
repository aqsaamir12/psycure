const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
        fee: { type: Number, required: true },
        zoom: { type: String ,required: true },
        name: { type: String , required: true },
        location: { type: String, required: true, enum: ['Remote', 'On-site'] },
        description: { type: String, trim: true },
        enabled: { type: Boolean, default: true }
    },
        { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
