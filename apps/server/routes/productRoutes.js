const { Router } = require("express");
const router = Router();

const productController = require("../controllers/productController.js");
const { authenticate } = require("../controllers/authMiddleware.js");

router.route("/").get(authenticate, productController.getAllProducts);

module.exports = router;
