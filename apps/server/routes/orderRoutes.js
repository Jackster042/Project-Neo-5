const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/orderController.js");

const { authenticate } = require("../middlewares/authMiddleware.js");

// TODO: NOTE - ALL THESE ROUTES WILL BE PROTECTED

router.route("/").get(authenticate, orderController.getOrder);
router.route("/").post(authenticate, orderController.createOrder);

module.exports = router;
