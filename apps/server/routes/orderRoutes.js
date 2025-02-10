const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/orderController.js");

// TODO: NOTE - ALL THESE ROUTES WILL BE PROTECTED

router.route("/").get(orderController.getOrder);
router.route("/").post(orderController.createOrder);

module.exports = router;
