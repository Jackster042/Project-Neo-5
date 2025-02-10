const { Router } = require("express");
const router = Router();

const cartController = require("../controllers/cartController.js");

// UTILS
const { authenticate } = require("../middlewares/authMiddleware.js");

// TODO: NOTE - ALL THESE ROUTES WILL BE PROTECTED

router.route("/").get(authenticate, cartController.getCart);
router.route("/add").post(authenticate, cartController.addToCart);
router.route("/clear").delete(authenticate, cartController.clearCart);
router
  .route("/delete/:productID")
  .delete(authenticate, cartController.removeFromCart);

module.exports = router;
