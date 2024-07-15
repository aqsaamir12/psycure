var express = require("express");
const therapistAuth = require("../../middleware/therapistAuth");
var router = express.Router();
const controller = require("../controller/therapist.controller");

router.post("/signup",controller.registerTherapist);
router.post("/login",therapistAuth, controller.login);
router.get("/", controller.index);
router.get("/list", controller.get);
router.get("/all", controller.getAllTherapist);
router.post("/create", controller.services);
router.get("/:therapistId", controller.serviceHistory);
router.delete("/:serviceId", controller.deleteService);
router.get("/get/:serviceId", controller.getServiceById);
router.put("/edit/:serviceId", controller.updateServiceById);
router.get("/:therapistId/:serviceId", controller.getTherapist);
router.put(
    "/edit-password",
    controller.editPassword
  );
  
module.exports = router;
