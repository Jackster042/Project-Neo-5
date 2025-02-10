const { Router } = require("express");
const router = Router();

const shippingController = require("../controllers/shippingController");
const { authenticate, restrictTo } = require("../middlewares/authMiddleware");

// Protected routes
router.use(authenticate);

// Calculate shipping rate
router.post("/calculate", shippingController.calculateShippingRate);

// Validate address
router.post("/validate-address", shippingController.validateAddress);

// Get shipping details
router.get("/order/:orderId", shippingController.getShippingDetails);

// Update shipping status (admin only)
router.patch(
  "/order/:orderId",
  restrictTo("admin"),
  shippingController.updateShippingStatus
);

module.exports = router;
