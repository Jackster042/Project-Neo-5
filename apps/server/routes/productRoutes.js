const { Router } = require("express");
const router = Router();

const productController = require("../controllers/productController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

router.route("/").get(authenticate, productController.getAllProducts);

module.exports = router;
