/**
 * Appointment Controller
 *
 * This controller handles various operations related to appointments, including creation,
 * retrieval, updating, and payment processing.
 *
 * @module controllers/appointment.controller
 */

const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const Appointment = require("../../model/appointment.model");
const AppointmentFeedback = require('../../model/appointment_feedback.model');
const Payment = require('../../model/payment.model');
const stripe = require("stripe")('sk_test_51OvR7XP40BAZPmSYCTwOdl483BRY9EhYI82TfGrg6RhfHw5mHUTDCvZkYQ4yG2IiAq0BpSG8OGB8QTRfYOnYb6sx008eaY95FA');

/**
 * Create a new appointment.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.createAppointment = async(req, res, next)=>{
    try {
        const { therapist, service, user,zoom, scheduled_date,location, scheduled_time, fee, status, reason, paid } = req.body;

        if (!therapist || !service || !user ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new appointment using the Appointment model
        const newAppointment = new Appointment({
            therapist: therapist,
            service: service,
            user: user,
            scheduled_date,
            scheduled_time,
            fee,
            zoom,
            location,
            status,
            reason,
            paid
        });
           // Save the appointment to the database
           const savedAppointment = await newAppointment.save();

        // Return the created appointment
        res.status(201).json({
            status: 201,
          success: true,
           message: 'Appointment created successfully',
            savedAppointment});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

/**
 * Retrieve appointments for a specific user.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getAppointment = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User id required' });
        }

        const appointments = await Appointment.aggregate([
            {
                $match: { 
                    $or: [
                        { user: new ObjectId(userId) }, // Find appointments for the user
                        { therapist: new ObjectId(userId) } // Find appointments for the therapist
                    ]
                }
            },
            {
                $lookup: {
                    from: 'appointmentfeedbacks', // Collection name of AppointmentFeedback
                    localField: '_id',
                    foreignField: 'appointment',
                    as: 'feedback'
                }
            },
            {
                $lookup: {
                    from: 'therapists', 
                    localField: 'therapist',
                    foreignField: '_id',
                    as: 'therapist'
                }
            },
            
        ]);

        if (!appointments) {
            return res.status(404).json({ error: 'Appointments not found' });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Retrieve appointments for a specific therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getTherapistAppointment = async(req, res, next)=>{
    try {
        const therapistId = req.params.therapistId;

        if(!therapistId) {
            return res.status(400).json({ error: 'Therapist id required' });
        }
        const appointments = await Appointment.find({ therapist: therapistId });

        if(!appointments) {
            return res.status(404).json({ error: 'Appointments not found' });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });
        
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieve appointment history for a specific therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getAppointmentHistory = async(req, res, next)=>{
    try {
        const therapistId = req.params.therapistId;

        if(!therapistId) {
            return res.status(400).json({ error: 'Therapist id required' });
        }
        const appointments = await Appointment.aggregate([
            {
                $match: { therapist: new ObjectId(therapistId) }
            },
            {
                $lookup: {
                    from: 'appointmentfeedbacks', 
                    localField: '_id',
                    foreignField: 'appointment',
                    as: 'feedback'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
        ]);

        if(!appointments) {
            return res.status(404).json({ error: 'Appointments not found' });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });
        
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieve a single appointment by its ID.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getSingleAppointment = async(req, res, next)=>{
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(400).json({ error: 'Appointment id required' });
        }
        const appointments = await Appointment.aggregate([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'appointmentfeedbacks', 
                    localField: '_id',
                    foreignField: 'appointment',
                    as: 'feedback'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
        ]);

        if(!appointments) {
            return res.status(404).json({ error: 'Appointments not found' });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });
        
    } catch (error) {
        next(error)
    }
}

/**
 * Update an existing appointment.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.update = async(req, res, next)=>{
    try {
        const appointmentId = req.params.id;
        
        const { zoom, status } = req.body;

        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, {
            zoom,
            status
        }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Calculate the payment amount.
 *
 * @param {number} fee - The fee for the appointment.
 * @returns {number} The payment amount in cents.
 */
const calculateOrderAmount = (fee) => {
    const feeInCents = fee * 100
    return feeInCents;
  };

  /**
 * Process payment for an appointment.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.payment= async (req, res, next) => {
   try {
    const {appointmentData} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(appointmentData?.fee),
      currency: "usd",
     
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
    });

    appointmentData.paymentIntentId = paymentIntent?.id;
      const payment = new Payment(
        appointmentData
      );

      await payment.save();
    res.send({
        success: true,
      clientSecret: paymentIntent.client_secret,
    });
   } catch (error) {
    if (error.type === 'StripeCardError') {
        res.status(400).json({ success: false, message: error.message });
    } else {
        next(error);
    }

   }
   
  };