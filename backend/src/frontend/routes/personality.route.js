var express = require("express");
var router = express.Router();
const controller = require("../controller/persanality.controller");

// Route to handle personality assessment
router.post("/:id", controller.personality);

module.exports = router;
