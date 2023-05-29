const express = require("express");
const router = express.Router();
const userRouter = require("./../controller/userController");
const authController = require("./../controller/authController");

router.post("/signup", authController.signUp);

router.route("/").get(userRouter.getAllUser).post(userRouter.createUser);

router
  .route("/:id")
  .get(userRouter.getUser)
  .patch(userRouter.updateUser)
  .delete(userRouter.deleteUser);

module.exports = router;
