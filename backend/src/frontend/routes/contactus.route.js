var express = require("express");
var router = express.Router();
const controller = require("../controller/contactQuery.controller");

// Route to create a contact query
router.post("/", controller.create);

// Route to get contact queries
router.get("/", controller.get);

module.exports = router;