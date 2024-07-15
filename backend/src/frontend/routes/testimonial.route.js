const express = require("express");
const router = express.Router();
const controller = require("../controller/testimonial.controler");

// Route to create a new testimonial
router.post("/", controller.create);

// Route to fetch testimonials
router.get("/", controller.get);

module.exports = router;