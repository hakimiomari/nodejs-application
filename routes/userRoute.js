const express = require("express");
const router = express.Router();
const userRouter = require("./../controller/userController");
const authController = require("./../controller/authController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

// password forgot and reset
router.post("/forgot", authController.forgotPassword);
router.post("/reset", authController.resetPassword);

router
  .route("/")
  .get(authController.protect, userRouter.getAllUser)
  .post(userRouter.createUser);

router
  .route("/:id")
  .get(userRouter.getUser)
  .patch(userRouter.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    userRouter.deleteUser
  );

module.exports = router;
