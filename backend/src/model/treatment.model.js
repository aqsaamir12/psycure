const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
    {
        personality: { type: mongoose.Schema.Types.ObjectId, ref: 'Personality', required: true },
        concern: { type: String, required: true, trim: true },
        recommendation: { type: String, required: true, trim: true },
    },
        {timestamps: true}
);

module.exports = mongoose.model('Treatment', treatmentSchema);
