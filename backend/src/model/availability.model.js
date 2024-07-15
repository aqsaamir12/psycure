const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    day: { type: String, required: true },
    schedualSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
