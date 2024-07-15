/**
 * Dashboard Controller
 *
 * This controller handles the retrieval of dashboard data.
 * It calculates and provides statistics such as the  upcoming appointments, previous appointments, cancelled appointments, and total payments.,
 *
 * @module controllers/list.controller
 */


const { ObjectId } = require("mongoose").Types;
const Appointment = require("../../model/appointment.model");
const Therapist = require("../../model/therapist.model");
const Payment = require("../../model/payment.model");

/**
 * Handles the retrieval of dashboard data, including statistics such as the total number of users, upcoming appointments, previous appointments, cancelled appointments, and total payments.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.list = async (req, res, next) => {
  try {
    const id = req.params.id;
    let appointmentUpcoming, appointmentPrevious, appointmentCancelled, totalPayment;

    const isTherapist = await Therapist.exists({ _id: id });
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (isTherapist) {
      [appointmentUpcoming, appointmentPrevious, appointmentCancelled, totalPayment] = await Promise.all([
        Appointment.countDocuments({ therapist: id, status: 0, scheduled_date: { $gte: startOfToday } }),
        Appointment.countDocuments({ therapist: id, status: 1, scheduled_date: { $lt: startOfToday } }),
        Appointment.countDocuments({ therapist: id, status: 2 }),
        Payment.aggregate([
          { $match: { therapist: new ObjectId(id), paid: true } },
          { $group: { _id: null, totalPayment: { $sum: "$fee" } } }
        ])
      ]);
    } else {

      [appointmentUpcoming, appointmentPrevious, appointmentCancelled, totalPayment] = await Promise.all([
        Appointment.countDocuments({ user: id, status: 0, scheduled_date: { $gte: startOfToday } }),
        Appointment.countDocuments({ user: id, status: 1, scheduled_date: { $lt: startOfToday } }),
        Appointment.countDocuments({ user: id, status: 2 }),
        Payment.aggregate([
          { $match: { user: new ObjectId(id), paid: true } },
          { $group: { _id: null, totalPayment: { $sum: "$fee" } } }
        ])
      ]);
    }

    return res.send({
      success: true,
      message: "Dashboard Data Fetched Successfully",
      dashboardData: {
        appointmentUpcoming,
        appointmentPrevious,
        appointmentCancelled,
        totalPayment
      },
    });
  } catch (error) {
    next(error);
  }
};
