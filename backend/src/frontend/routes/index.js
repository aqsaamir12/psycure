var express = require("express");
var router = express.Router();
const authModule = require("./auth.route");
const personalityModule = require("./personality.route"); 
const therapistModule = require("./therapist.route"); 
const ContactUsModule = require("./contactus.route");
const AppointmentsModule = require("./appointment.route");
const PaymentModule = require("./payment.route") ;
const AvailabilityModule = require("./availability.route")
const DashboardRoutes = require("./dashboard.route");
const TestmonialRoutes = require("./testimonial.route");

// Mounting routes for different modules
router.use("/auth", authModule);
router.use("/personality", personalityModule);
router.use("/therapistData", therapistModule);
router.use("/dashboard", DashboardRoutes);
router.use("/testimonial", TestmonialRoutes);
router.use("/appointment", AppointmentsModule);
router.use("/payment", PaymentModule);
router.use("/availability", AvailabilityModule);
router.use("/contact", ContactUsModule);


module.exports = router;