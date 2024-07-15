const AppointmentFeedback = require('../../model/appointment_feedback.model');

/**
 * Creates a new testimonial for an appointment.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.create = async (req, res, next) => {
    try {

        const { appointmentId, userId, message, rating } = req.body;

        const testimonial = new AppointmentFeedback({
            appointment: appointmentId,
            user: userId,
            message,
            rating
        });


        await testimonial.save();

        res.status(201).json({ success: true, message: 'Testimonial added successfully' });
    } catch (error) {
        next(error)
        console.error('Error adding testimonial:', error);
    }
};

/**
 * Retrieves all testimonials.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.get = async (req, res, next) => {
    try {

        const testimonial = await AppointmentFeedback.find({}).populate('user', 'fname lname profileImage email');

        res.status(200).json({ success: true,testimonial, message: 'Testimonial fetched successfully' });
    } catch (error) {
        next(error)
        console.error('Error fetching testimonial:', error);
    }
};
