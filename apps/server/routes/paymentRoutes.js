const { Router } = require("express");
const router = Router();

const paymentController = require("../controllers/paymentController.js");

// TODO: NOTE - ALL THESE ROUTES WILL BE PROTECTED

router.route("/").post(paymentController.processPayment);

module.exports = router;
