const { Router } = require("express");
const router = Router();

const paymentController = require("../controllers/paymentController.js");
const {
  authenticate,
  restrictTo,
} = require("../middlewares/authMiddleware.js");

// Protected payment routes
router.use(authenticate); // Apply authentication to all payment routes

// Create payment intent (when customer initiates payment)
router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post(
  "/test-confirm-payment",
  paymentController.testConfirmPaymentIntent
);

// Get payments for a specific order
router.get("/order/:orderID", paymentController.getPaymentsByOrder);

// Process refund - restricted to admin
router.post(
  "/refund/:paymentID",
  restrictTo("admin"),
  paymentController.processRefund
);

// Stripe webhook - should be unprotected and raw body available
// This should be used in your main app.js/index.js instead
// app.post('/webhook', express.raw({type: 'application/json'}), paymentController.handlePaymentWebhook);

module.exports = router;
