const { Router } = require("express");
const router = Router();

// CONTROLLERS
const productController = require("../controllers/productController.js");

// UTILS
const { authenticate } = require("../middlewares/authMiddleware.js");

router.route("/").get(productController.getAllProducts);

module.exports = router;
