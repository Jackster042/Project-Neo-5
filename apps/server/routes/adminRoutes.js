const { Router } = require("express");
const router = Router();

const adminController = require("../controllers/adminController.js");
const {
  authenticate,
  restrictTo,
} = require("../middlewares/authMiddleware.js");

router.route("/").get(authenticate, restrictTo("admin"), adminController.admin);
router.patch(
  "/cancel/:orderID",
  authenticate,
  restrictTo("admin"),
  adminController.adminCancelOrder
);

module.exports = router;
