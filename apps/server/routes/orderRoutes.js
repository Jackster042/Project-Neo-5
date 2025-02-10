const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/orderController.js");

const {
  authenticate,
  restrictTo,
} = require("../middlewares/authMiddleware.js");
// const { isAdmin } = require("../middlewares/adminMiddleware.js");

// TODO: NOTE - ALL THESE ROUTES WILL BE PROTECTED

router.route("/").get(authenticate, orderController.getOrders);
router.route("/").post(authenticate, orderController.createOrder);
router
  .route("/:orderID/status")
  .put(authenticate, orderController.updateOrderStatus);
router.route("/:orderID").get(authenticate, orderController.getOrderById);

router.patch("/cancel/:orderID", authenticate, orderController.cancelOrder);

module.exports = router;
