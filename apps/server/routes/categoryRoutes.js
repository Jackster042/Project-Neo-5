const { Router } = require("express");
const router = Router();

const categoryController = require("../controllers/categoryController.js");
const {
  authenticate,
  restrictTo,
} = require("../middlewares/authMiddleware.js");

// TODO: ADD ROUTE PROTECTION - ADMIN ONLY
router
  .route("/")
  .post(
    authenticate,
    restrictTo("admin"),
    categoryController.generateCategories
  );

router.route("/").get(categoryController.getAllCategories);
router.route("/:categoryID").get(categoryController.getSingleCategory);

module.exports = router;
