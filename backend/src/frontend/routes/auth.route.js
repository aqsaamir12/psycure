var express = require("express");
const loginAuth = require("../../middleware/loginAuth");
var router = express.Router();
const controller = require("../controller/auth.controller");

// Route to register a new user
router.route("/signup").post(controller.register);

// Route to login
router.route("/login").post(loginAuth, controller.login);

// Route to get user profile by ID
router.route("/profile/:id").get( controller.getProfile);

// Route to update user profile by ID
router.route("/profile/update/:id").put( controller.updateProfile);

// Route to edit user password
router.put(
    "/edit-password",
    controller.editPassword
  );

module.exports = router;