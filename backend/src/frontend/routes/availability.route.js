const express = require("express");
const router = express.Router();
const controller = require("../controller/availability.controller");

// Route to add availability
router.post("/", controller.addAvailability);

// Route to delete availability
router.delete("/", controller.deleteAvailability);

// Route to update availability by ID
router.put("/:id", controller.updateAvailability);

// Route to get all availabilities
router.get("/", controller.getAvailability);

// Route to get availability for a specific day
router.get("/day-availability", controller.getDayAvailability);

// Route to get availability for a therapist
router.get("/day", controller.getTherapistAvailability);

module.exports = router;
