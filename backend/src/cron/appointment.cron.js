/**
 * Data Scrapping Cron Job
 *
 * This module defines a cron job for data scrapping:
 * It runs daily at midnight to find appointments that have passed their scheduled date and time
 * but have not been canceled. It then updates the status of these appointments to indicate they are
 * previous appointments.
 *
 * @module cron/dataScrapping.cron
 */

var cron = require("node-cron");
const Appointment = require('../model/appointment.model');



exports.dataScrapping = cron.schedule("0 0 * * *", async() => {
  try {
        const currentDate = new Date();
    
        // Find appointments where scheduled_date and time are earlier than the current date and time
        const outdatedAppointments = await Appointment.find({
          scheduled_date: { $lt: currentDate },
          status: { $ne: 2 }, // Exclude appointments with status 2 (canceled)
          $expr: {
            $lte: [
              {
                $concat: [
                  { $toString: "$scheduled_date" },
                  " ",
                  "$scheduled_time"
                ]
              },
              { $toString: currentDate }
            ]
          }
        });
    
        // Update status to 1 for outdated appointments
        if (outdatedAppointments?.length > 0) {
          await Appointment.updateMany(
            { _id: { $in: outdatedAppointments.map(appt => appt._id) } },
            { $set: { status: 1 } }
          );
          console.log(`${outdatedAppointments?.length} appointment(s) updated.`);
        } else {
          console.log('No outdated appointments found.');
        }
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
});