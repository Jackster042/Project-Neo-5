const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController.js");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);

module.exports = router;
