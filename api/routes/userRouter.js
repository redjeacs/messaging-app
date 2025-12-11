const { Router } = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/Verifytoken");

const userRouter = Router();

userRouter.get("/", verifyToken, userController.checkSignin);
userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", userController.signin);

module.exports = userRouter;
