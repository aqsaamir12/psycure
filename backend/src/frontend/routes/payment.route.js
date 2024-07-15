var express = require("express");
var router = express.Router();
const controller = require("../controller/payment.controller");

// Route to list payments
router.get("/:id", controller.list);

module.exports = router;
