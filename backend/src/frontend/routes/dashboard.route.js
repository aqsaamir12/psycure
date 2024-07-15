const express = require("express");
const router = express.Router();
const controller = require("../controller/dashboard.controller");

// Route to list dashboard data
router.get(
  "/:id",
  controller.list
);

module.exports = router;
