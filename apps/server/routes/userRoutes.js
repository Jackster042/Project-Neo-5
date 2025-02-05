const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController.js");
const refreshController = require("../controllers/refreshController.js");
const authLimiter = require("../middlewares/authLimiter.js");

router.route("/register").post(authLimiter, userController.register);
router.route("/login").post(authLimiter, userController.login);
router.route("/refresh-token").post(refreshController.refreshToken);

module.exports = router;
