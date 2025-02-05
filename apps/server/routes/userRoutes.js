const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController.js");
const refreshController = require("../controllers/refreshController.js");
const authLimiter = require("../middlewares/authLimiter.js");
const {
  validationRegister,
  validationLogin,
} = require("../middlewares/validators.js");

router
  .route("/register")
  .post(authLimiter, validationRegister, userController.register);
router.route("/login").post(authLimiter, validationLogin, userController.login);
router.route("/refresh-token").post(refreshController.refreshToken);

module.exports = router;
