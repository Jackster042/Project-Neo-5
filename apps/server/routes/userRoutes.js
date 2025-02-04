const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController.js");
const authLimiter = require("../middlewares/authLimiter.js");

router.route("/register").post(authLimiter, userController.register);
router.route("/login").post(authLimiter, userController.login);

module.exports = router;
